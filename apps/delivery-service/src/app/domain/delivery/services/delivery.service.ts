import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@fbe/config";
import { Like, Repository, QueryRunner, Connection } from "typeorm";
import { Logger } from "@fbe/logger";
import { DeliveryEntity } from "../entity/delivery.entity";
import { UserProxyService } from "./user.http.service";

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private deliveryRepo: Repository<DeliveryEntity>,
    private readonly logger: Logger,
    private readonly userProxyService: UserProxyService,
    private readonly connection: Connection
  ) {}

  async getCurrentOrdersForDeliveryPartner(partnerId: string) {
    const getCurrentOrders = await this.deliveryRepo.findOne({
      where: { delivery_partner_id: partnerId, partner_assigned: true },
    });
    return getCurrentOrders;
  }

  async getAvailableOrdersForDelivery() {
    const availableOrders = await this.deliveryRepo.find({
      where: { partner_assigned: false },
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
