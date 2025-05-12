import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository, QueryRunner, Connection, Not } from 'typeorm';
import { Logger } from '@fbe/logger';
import { DeliveryEntity } from "../entity/delivery.entity";
import { UserProxyService } from "./user.http.service";
import { LocationDto} from "../dto/update-current-location.dto";


@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private deliveryRepo: Repository<DeliveryEntity>,
    private readonly logger: Logger,
    private readonly userProxyService: UserProxyService,
    private readonly connection:Connection
    
  ) {}

  
  async updateCurrentLocation(partnerId: string, location:LocationDto) {
    const delivery = await this.deliveryRepo.findOneBy({ delivery_partner_id: partnerId,partner_assigned:true});
    if (!delivery) throw new NotFoundException('Delivery partner not found');
    delivery.current_location = location;
    await this.deliveryRepo.save(delivery);
    return {currentLocation:delivery.current_location};
  }
  
  async getDeliveryOrdersHistory(partnerId:string){
    const getCurrentOrders= await this.deliveryRepo.findOne({
      where:{delivery_partner_id:partnerId,partner_assigned:true,order_status:'delivered'},
    });
    if (!getCurrentOrders) {
    return { CurrentOrder: null, orderStatus: null };
  }
    return {CurrentOrder:getCurrentOrders.order,orderStatus:getCurrentOrders.order_status};
  }

  async getCurrentOrdersForDeliveryPartner(partnerId:string){
    const getCurrentOrders= await this.deliveryRepo.findOne({
      where:{delivery_partner_id:partnerId,partner_assigned:true,order_status:Not('delivered')},
    });
    if (!getCurrentOrders) {
    return { CurrentOrder: null, orderStatus: null };
  }
    return {CurrentOrder:getCurrentOrders.order,orderStatus:getCurrentOrders.order_status};
  }

  async getAvailableOrdersForDelivery(){
    const availableOrders= await this.deliveryRepo.find({
      where:{partner_assigned:false},
      order:{created_at:'ASC'}
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
  

  async confirmDelivery(orderId:string,deliveryPartnerId:string){
    try{
      const deliveredOrder=await this.deliveryRepo.findOne({
        where:{order_id:orderId}
      });

      if (!deliveredOrder) {
        throw new NotFoundException(`Order ${orderId} not found`);
      }

      deliveredOrder.order_status="delivered";

      await this.userProxyService.markDeliveryPartnerUnassigned({
        orderId,
        partnerId:deliveryPartnerId,
      });

      return this.deliveryRepo.save(deliveredOrder)

    }
    catch(e){

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
