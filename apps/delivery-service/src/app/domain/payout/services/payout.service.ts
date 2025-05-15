import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Logger } from "@fbe/logger";
import { Repository } from "typeorm";
import Stripe from "stripe";

import { NotFoundException } from "@nestjs/common";

import { UserMetaData } from "../../auth/guards/user";
import { PayoutEntity } from "../entity/payout.entity";
import {
  CreatePaymentBodyDto,
  UpdateByIdDto,
  UpdateByIdQueryDto,
  UpdatePaymentBodyDto,
} from "../dto/payout.dto";

@Injectable()
export class PayoutService implements OnModuleInit {
  private stripe: any;
  constructor(
    private readonly logger: Logger,
    @InjectRepository(PayoutEntity)
    private payRepo: Repository<PayoutEntity>
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY!, {
      apiVersion: "2023-08-16",
    });
  }
  async onModuleInit() {
    try {
    } catch (err) {
      console.log(err);
    }
  }

  async updatePayout(user: UserMetaData, payload: UpdatePaymentBodyDto) {
    if (!payload) {
      throw new NotFoundException();
    }
    const Payout = await this.payRepo.findOne({
      where: {
        order_id: payload.order_id,
      },
    });
    // update Payout status to success or feailed for order Id
    Payout.status = payload.status;
    /* this.client.emit<any>("Payout_status_updated", {
      order_id: payload.order_id,
      status: payload.status,
    });
    */
    return await Payout.save();
  }

  async confirmPayout(
    user: UserMetaData,
    param: UpdateByIdDto,
    query: UpdateByIdQueryDto
  ) {
    const Payout = await this.payRepo.findOne({
      where: {
        id: param.id,
      },
    });

    if (!Payout) {
      throw new NotFoundException();
    }
    // update Payout status to success or feailed for order Id
    Payout.status = query.status;
    return await Payout.save();
  }

  async createPayout(user: UserMetaData, payload: CreatePaymentBodyDto) {
    const items = payload.menu_items;
    let totalAmount = 0;
    items.forEach((i) => {
      totalAmount = totalAmount + i.count * i.price;
    });

    const Payout = await this.payRepo.save({
      user_id: user.userId,
      business_id: payload.business_id,
      menu_items: payload.menu_items,
      order_id: payload.order_id,
      amount: totalAmount,
      status: "in_progress",
    });
    const status = await this.stripe.PayoutIntents.create({
      amount: totalAmount,
      currency: "usd",
    });

    return {
      ...status,
      id: Payout.id,
    };
  }
}
