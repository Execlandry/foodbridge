import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, QueryRunner, Connection, Not } from "typeorm";
import { Logger } from "@fbe/logger";
import { DeliveryEntity } from "../entity/delivery.entity";
import { UserProxyService } from "./user.http.service";
import { LocationDto } from "../dto/update-current-location.dto";
import { PayoutEntity } from "../../payout/entity/payout.entity";
import { UserMetaData } from "../../auth/guards/user";
import { get } from "http";

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private deliveryRepo: Repository<DeliveryEntity>,
    @InjectRepository(PayoutEntity)
    private payoutRepo: Repository<PayoutEntity>,
    private readonly logger: Logger,
    private readonly userProxyService: UserProxyService,
    private readonly connection: Connection
  ) {}

  async setOtpVerified(partnerId:string,otp:string){
    const deliveryPartner= await this.deliveryRepo.findOne({
      //get the partner row that has been currently assigned to a order
      //TODO::get the order id for assurance from the frontend(optional)
      where:{delivery_partner_id:partnerId,partner_assigned:true,order_status:"pending"},
    })

    
    if (!deliveryPartner) throw new NotFoundException("Delivery partner not found");
    if(deliveryPartner.order.otp!==otp){
      throw new ForbiddenException('Invalid OTP');
    }
    if (deliveryPartner.order.is_otp_verified) {
    throw new ConflictException('OTP already verified');
  }
    //get deliveryPartner.order otp for currently assigned delivery partner
    deliveryPartner.order.is_otp_verified=true
    //patch the order status
    deliveryPartner.order_status="in_transit"
    await this.deliveryRepo.save(deliveryPartner);
    //change this
    return {success:"OTP Verified successfully"};
  }
  async getOrderOtpStatus(partnerId: string) {
  const deliveryPartner = await this.deliveryRepo.findOne({
    where: {
      delivery_partner_id: partnerId,
      partner_assigned: true,
      order_status: Not("delivered"),
    },
  });

  if (!deliveryPartner || !deliveryPartner.order) {
    throw new NotFoundException("No current assigned order found");
  }

  return {
    is_otp_verified: deliveryPartner.order.is_otp_verified,
  };
}


  async updateCurrentLocation(partnerId: string, location: LocationDto) {
    const delivery = await this.deliveryRepo.findOneBy({
      delivery_partner_id: partnerId,
      partner_assigned: true,
    });
    if (!delivery) throw new NotFoundException("Delivery partner not found");
    delivery.current_location = location;
    await this.deliveryRepo.save(delivery);
    return { currentLocation: delivery.current_location };
  }

  async getOrderWithSuccessfulPayout(deliveryPartnerId: string) {
    const result = await this.deliveryRepo
      .createQueryBuilder("delivery")
      .innerJoinAndMapOne(
        "delivery.payout",
        PayoutEntity,
        "payout",
        "delivery.order_id = payout.order_id AND delivery.delivery_partner_id = payout.delivery_partner_id"
      )
      .where("delivery.delivery_partner_id = :deliveryPartnerId", {
        deliveryPartnerId,
      })
      .andWhere("delivery.order_status = :orderStatus", {
        orderStatus: "delivered",
      })
      .andWhere("payout.payment_status = :paymentStatus", {
        paymentStatus: "success",
      })
      .select([
        "delivery.order AS order_details",
        "delivery.order_status AS order_status",
        "payout.amount AS amount",
        "payout.commission AS commission",
        "payout.net_amount AS net_amount",
        "payout.payment_method AS payment_method",
        "payout.stripe_payment_intent_id AS stripe_payment_intent_id",
      ])
      .getRawMany();

    return result.map((item) => ({
      order_details: item.order_details,
      order_status: item.order_status,
      payment_details: {
        amount: item.amount,
        commission: item.commission,
        net_amount: item.net_amount,
        payment_method: item.payment_method,
        stripe_payment_intent_id: item.stripe_payment_intent_id,
      },
    }));
  }

  async getCurrentOrdersForDeliveryPartner(partnerId: string) {
    const getCurrentOrders = await this.deliveryRepo.findOne({
      where: {
        delivery_partner_id: partnerId,
        partner_assigned: true,
        order_status: Not("delivered"),
      },
    });
    if (!getCurrentOrders) {
      return { CurrentOrder: null, orderStatus: null };
    }
    return {
      CurrentOrder: getCurrentOrders.order,
      orderStatus: getCurrentOrders.order_status,
    };
  }

  async fetchOrderById(orderId: string) {
    const Order = await this.deliveryRepo.findOne({
      where: {
        order_id: orderId,
      },
    });
    return Order;
  }

  
  async FetchAllOrders(orderId: string) {
    const Order = await this.deliveryRepo.findOne({
      where: {
        order_id: orderId,
      },
    });
    return Order;
  }

  async FetchOrdersByUserId(userId: UserMetaData) {
  const deliveries = await this.deliveryRepo
      .createQueryBuilder("delivery")
      .innerJoinAndMapOne(
        "delivery.payout",
        PayoutEntity,
        "payout",
        "delivery.order_id = payout.order_id"
      )
    .where(`delivery.order->>'user_id' = :userId`, { userId })
        .select([
        "delivery.order AS order",
        "delivery.order_status AS order_status",
        "payout.payment_status AS payment_status",
      ])
      .getRawMany();

  return deliveries.map((item)=>({
    ...item.order,
    order_status:item.order_status,
    payment_status:item.payment_status,
  }))
}

  async getAvailableOrdersForDelivery() {
    const availableOrders = await this.deliveryRepo.find({
      where: { partner_assigned: false },
      order: { created_at: "ASC" },
    });
    return availableOrders;
  }

  async assignOrder(orderId: string, deliveryPartnerId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const order = await queryRunner.manager.findOne(DeliveryEntity, {
        where: { order_id: orderId },
        lock: { mode: "pessimistic_write" },
      });

      if (!order) {
        throw new NotFoundException(`Order ${orderId} not found`);
      }

      if (order.partner_assigned) {
        throw new ForbiddenException(`Order ${orderId} is already assigned`);
      }

      const partnerDetails =
        await this.userProxyService.fetchDeliveryPartnerDetails(
          deliveryPartnerId
        );
      if (!partnerDetails.availability) {
        throw new ForbiddenException(
          `Delivery partner ${deliveryPartnerId} is currently unavailable`
        );
      }

      await this.userProxyService.markDeliveryPartnerAssigned({
        orderId,
        partnerId: deliveryPartnerId,
      });

      order.delivery_partner_id = deliveryPartnerId;
      order.partner_assigned = true;
      order.updated_at = new Date();
      order.delivery_partner = partnerDetails;

      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return {
        success: true,
        order,
        partnerId: deliveryPartnerId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Assignment failed for order ${orderId} and partner ${deliveryPartnerId}. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );

      throw this.mapError(error);
    } finally {
      await queryRunner.release();
    }
  }

  private mapError(error: unknown) {
    if (error instanceof NotFoundException) return error;
    if (error instanceof ForbiddenException) return error;

    return new InternalServerErrorException({
      code: "ASSIGNMENT_FAILED",
      message: error instanceof Error ? error.message : "Assignment failed",
    });
  }

  async registerDeliveryAssignTask(orderReceived: any) {
    const deliveryTask = await this.deliveryRepo.save({
      order_id: orderReceived.id,
      order: orderReceived,
      partner_assigned: false,
    });
    this.logger.log(
      `Created delivery task ${deliveryTask.id} for order ${orderReceived.id}`
    );
    return deliveryTask;
  }
}