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
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const otp = await this.generateOtp();
      const order = this.orderRepo.create({
        user_id: user.userId,
        owner_id:payload.business.owner_id,
        address: {
          ...payload.address,
          user: {
            name: payload.user.name,
            id: payload.user.id,
            email: payload.user.email,
            first_name: payload.user.first_name,
            last_name: payload.user.last_name,
            mobno: payload.user.mobno,
            picture_url: payload.user.picture_url,
          },
        },
        business: payload.business,
        amount: payload.amount,
        menu_items: payload.menu_items,
        otp,
        request_for_driver: payload.request_for_driver,
      });
      const savedOrder = await this.orderRepo.save(order);
      await queryRunner.commitTransaction();

      if (savedOrder.request_for_driver) {
        this.client.emit("order_processed_success", savedOrder);
      }
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Order creation failed: ${error.message}`);

      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to create order");
    } finally {
      await queryRunner.release();
    }
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

   async getAllBusinessOrders(user: UserMetaData) {
    return this.orderRepo.find({
      where: {
        owner_id: user.userId,
      },
    });
  }

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
