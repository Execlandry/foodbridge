import { Injectable } from "@nestjs/common";
import { DeliveryEntity } from "../entity/delivery.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserProxyService } from "./user.http.service";

@Injectable()
export class DeliveryEventService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private deliveryRepo: Repository<DeliveryEntity>,
    private readonly userProxyService: UserProxyService
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async assignOrder() {
  //   const unassignedOrders = await this.deliveryRepo.find({
  //     where: {
  //       partner_assigned: false,
  //     },
  //   });

  //   for (const order of unassignedOrders) {
  //     const partner: any =
  //       await this.userProxyService.fetchAvailableDeliveryPartners();

  //     const orderData = order;
  //     if (partner) {
  //       orderData.delivery_partner = partner;
  //       orderData.delivery_partner_id = partner.id;
  //       orderData.partner_assigned = true;
  //       await this.userProxyService.fetchAvailableDeliveryPartners();
  //     } else {
  //       console.log(`No available partner try again ...`);
  //     }
  //   }
  // }
}
