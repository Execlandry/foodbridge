import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@fbe/config";
import { Logger } from "@fbe/logger";
import { Like, Repository, Connection, QueryRunner } from "typeorm";

import { NotFoundException } from "@nestjs/common";
import { OrderEntity } from "../entity/order.entity";

import {
  CreatePaymentBodyDto,
  // PaymentStatus,
  UpdateByIdDto,
} from "../dto/order.dto";
import { UserMetaData } from "../../auth/guards/user";
import { ClientProxy } from "@nestjs/microservices";
@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    @Inject("ORDER_LISTENER_SERVICE")
    private readonly client: ClientProxy,

    private readonly logger: Logger,
    private readonly connection: Connection,
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (err) {
      console.log(err);
    }
  }

  async createOrder(user: UserMetaData, payload: CreatePaymentBodyDto) {
    const order = this.orderRepo.create({
      user_id: user.userId,
      address: {
        ...payload.address,
        user: {
          name: payload.user.name,
          id: payload.user.id,
          email: payload.user.email,
          first_name: payload.user.first_name,
          last_name: payload.user.lastname,
          mobno: payload.user.mobno,
        },
      },
      business: payload.business,
      amount: payload.amount,
      driver: payload.driver,
      menu_items: payload.menu_items,
      order_status: "pending",
      payment_status: "pending",
      payment_method: "upi",
      driver_id: payload.driver_id,
      request_for_driver: payload.request_for_driver,
    });

    const savedOrder = await this.orderRepo.save(order);
    if (savedOrder.request_for_driver) {
      this.client.emit("order_processed_success", savedOrder);
    }
    return savedOrder;
  }

  async getOrderOtp(param: UpdateByIdDto) {
    return this.orderRepo.findOne({ where: { id: param.id }, select: ["otp"] });
  }
  private generateOtp(length = 6): string {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return otp;
  }

  async getAllOrders(user: UserMetaData) {
    return this.orderRepo.find({
      where: {
        user_id: user.userId,
      },
    });
  }

  //for payment history
  async getLastPaymentProcessedOrder(user: UserMetaData) {
    // fetch last processed order for tracking and delivery
    const order = await this.orderRepo.findOne({
      where: {
        order_status: "payment_processed",
        user_id: user.userId,
      },
    });
    return order;
  }

    async getOrderByUserID(user: UserMetaData) {
    // fetch last processed order for tracking and delivery
    const order = await this.orderRepo.find({
      where: {
        user_id: user.userId,
      },
    });
    return order;
  }

  // async confirmOrderPayment(
  //   user: UserMetaData,
  //   param: UpdateByIdDto,
  //   query: UpdateByIdQueryDto
  // ) {
  //   const order = await this.orderRepo.findOne({
  //     where: {
  //       id: param.id,
  //     },
  //   });

  //   if (!order) {
  //     throw new NotFoundException();
  //   }
  //   // update payment status to success or feailed for order Id
  //   order.payment_status = query.status;
  //   order.order_status =
  //     query.status === PaymentStatus.success
  //       ? "payment_processed"
  //       : "payment_failed";
  //   const savedOrder = await order.save();

  //   if (PaymentStatus.success === query.status) {
  //     this.client.emit("order_payment_success", {
  //       order_id: savedOrder.id,
  //       order: savedOrder,
  //     });
  //   }
  //   return savedOrder;
  // }

  // async acceptOrder(orderId: string, partnerId: string) {
  //   const queryRunner = this.connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try{
  //     const order= await queryRunner.manager.findOne(OrderEntity,{
  //       where:{id:orderId},
  //       lock:{mode:"pessimistic_write"}
  //     });
  //     if(!order) throw new NotFoundException("Order not found");
  //     if(order.driver_id) throw new ConflictException('Order already taken');

  //     await queryRunner.manager.update(OrderEntity,orderId,{
  //       driver_id:partnerId,
  //       order_status:'accepted'
  //     });

  //     await queryRunner.commitTransaction();
  //     return{success:true,order};
  //   }
  //   catch(err){
  //     await queryRunner.rollbackTransaction();
  //     throw err;
  //   }
  //   finally{
  //     await queryRunner.release();
  //   }
  // }

  // async processPayment(orderId: string, payload: ProcessPaymentDto) {
  //   const queryRunner = this.connection.createQueryRunner();

  //   try {
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     const order = await queryRunner.manager.findOne(OrderEntity, {
  //       where: { id: orderId },
  //       lock: { mode: "pessimistic_write" }
  //     });

  //     if (!order) throw new NotFoundException("Order not found");
  //     if (order.payment_status !== "pending") {
  //       throw new ConflictException("Payment already processed");
  //     }

  //     const updatedOrder = await queryRunner.manager.save(OrderEntity, {
  //       ...order,
  //       payment_status: payload.success ? "success" : "failed",
  //       order_status: payload.success ? "pending" : "canceled"
  //     });

  //     await queryRunner.commitTransaction();

  //     this.client.emit(
  //       `payment_${payload.success ? "success" : "failed"}`,
  //       updatedOrder
  //     );

  //     return updatedOrder;
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     throw err;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async confirmOrder(
  //   user: UserMetaData,
  //   param: UpdateByIdDto,
  //   query: UpdateByIdQueryDto
  // ) {
  //   const order = await this.orderRepo.findOne({
  //     where: {
  //       id: param.id,
  //     },
  //   });

  //   if (!order) {
  //     throw new NotFoundException();
  //   }
  //   // update payment status to success or feailed for order Id
  //   order.payment_status = query.status;
  //   order.order_status =
  //     query.status === PaymentStatus.success
  //       ? "payment_processed"
  //       : "payment_failed";
  //   const savedOrder = await order.save();

  //   if (PaymentStatus.success === query.status) {
  //     this.client.emit("order_payment_success", {
  //       order_id: savedOrder.id,
  //       order: savedOrder,
  //     });
  //   }
  //   return savedOrder;
  // }

  // async testRMQ() {
  //   // TESTING ONLY
  //   this.client.emit<any>("order_processed_success", {
  //     order_id: "UUID",
  //     order: {
  //       name: "TEST JSON PAYLOAD",
  //     },
  //   });
  // }
}
