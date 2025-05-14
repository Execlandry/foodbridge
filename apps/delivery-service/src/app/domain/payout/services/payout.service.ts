import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Logger } from "@fbe/logger";
import { Repository } from "typeorm";
import Stripe from "stripe";
import { DeliveryEntity } from "../../delivery/entity/delivery.entity";
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
    private payRepo: Repository<PayoutEntity>,
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepo: Repository<DeliveryEntity>
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
    // Payout.status = payload.status;
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
    // Payout.status = query.status;
    return await Payout.save();
  }

  //   async createPayout1(user: UserMetaData, payload: CreatePaymentBodyDto) {
  //   const fixedAmount = 1000; // Amount in cents (e.g., ₹10.00 = 1000 paisa if using INR)
  //   const commissionPercentage = 0.1; // 10%
  //   const commission = Math.floor(fixedAmount * commissionPercentage);

  //   // Save payout record in DB
  //   const payout = await this.payRepo.save({
  //     user_id: user.userId,
  //     business_id: payload.business_id,
  //     delivery_id: payload.delivery_id,
  //     delivery_acc_id: payload.delivery_acc_id,
  //     order_id: payload.order_id,
  //     amount: fixedAmount,
  //     payment_status: "success",
  //     payment_method: "upi", // or from payload if dynamic
  //     menu_items: payload.menu_items,
  //   });

  //   // Create PaymentIntent with destination and commission
  //   const paymentIntent = await this.stripe.paymentIntents.create({
  //     amount: fixedAmount,
  //     currency: "inr", // or "inr", depends on your platform
  //     payment_method_types: ["upi"],
  //     application_fee_amount: commission,
  //     transfer_data: {
  //       destination: payload.delivery_acc_id, // connected account ID
  //     },
  //     metadata: {
  //       payout_id: payout.id,
  //       user_id: user.userId,
  //       order_id: payload.order_id,
  //       delivery_id: payload.delivery_id,
  //     },
  //   });

  //   const delivery = await this.deliveryRepo.findOne({
  //     where: { id: payload.delivery_id },
  //   });

  //   if (!delivery) {
  //     throw new Error("Delivery entity not found");
  //   }

  //   delivery.order_status = "success"; // or "paid", "in_progress", etc.
  //   await this.deliveryRepo.save(delivery);
  //   // Return payment details to frontend
  //   return {
  //     payout_id: payout.id,
  //     payment_intent_client_secret: paymentIntent.client_secret,
  //     commission,
  //     amount_sent_to_delivery: fixedAmount - commission,
  //     delivery_account: payload.delivery_id,
  //   };
  // }

  async createPayout(paymentIntent: Stripe.PaymentIntent, payload: any) {
    try {
      console.log("👉 paymentIntent received:", paymentIntent);

      // Example logic to get amount
      const amount = paymentIntent.amount; // in cents
      const amountToSend = Math.floor(amount * 0.9); // send 90%
      console.log("💰 Amount", amount);
      // Extract delivery person ID or Stripe account ID
      const connectedAccountId = payload.delivery_acc_id; // replace this with dynamic value from DB or payload

      // Make the payout (or transfer)
      const payout = await this.stripe.transfers.create({
        amount: amountToSend,
        currency: "usd",
        destination: connectedAccountId,
        transfer_group: paymentIntent.id,
      });
      const payout1 = await this.payRepo.save({
        user_id: payout.userId,
        business_id: payload.business_id,
        delivery_id: payload.delivery_id,
        delivery_acc_id: payload.delivery_acc_id,
        order_id: payload.order_id,
        amount: amountToSend,
        payment_status: "success",
        payment_method: "upi", // or from payload if dynamic
        menu_items: payload.menu_items,
      });
      const delivery = await this.deliveryRepo.findOne({
        where: { id: payload.delivery_id },
      });

      if (!delivery) {
        throw new Error("Delivery entity not found");
      }

      delivery.order_status = "success"; // or "paid", "in_progress", etc.
      await this.deliveryRepo.save(delivery);

      console.log("✅ Payout success:", payout);
      return payout;
    } catch (error) {
      console.error("❌ Error creating payout:", error.message);
      throw new Error("Failed to create payout");
    }
  }

  async getDeliveredOrdersByDeliveryPartner(user: UserMetaData) {
    const deliveredDeliveries = await this.deliveryRepo.find({
      where: {
        delivery_partner_id: user.userId,
        order_status: "success",
      },
      select: ["id", "order_id", "order_status", "order", "updated_at"], // Select only needed fields
    });

    if (!deliveredDeliveries || deliveredDeliveries.length === 0) {
      throw new NotFoundException(
        "No delivered orders found for this delivery partner."
      );
    }

    return deliveredDeliveries.map((delivery) => ({
      delivery_id: delivery.id,
      order_id: delivery.order_id,
      status: delivery.order_status,
      order_details: delivery.order,
      delivered_at: delivery.updated_at,
    }));
  }
}
