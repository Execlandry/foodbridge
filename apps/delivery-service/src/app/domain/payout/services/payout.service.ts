import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Logger } from "@fbe/logger";
import { Repository } from "typeorm";
import Stripe from "stripe";
import { DeliveryEntity } from "../../delivery/entity/delivery.entity";
import { PayoutEntity } from "../entity/payout.entity";
import { UserProxyService } from "../../delivery/services/user.http.service";

@Injectable()
export class PayoutService implements OnModuleInit {
  private stripe: Stripe;
  constructor(
    private readonly logger: Logger,
    @InjectRepository(PayoutEntity)
    private payRepo: Repository<PayoutEntity>,
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepo: Repository<DeliveryEntity>,
    private readonly userProxyService: UserProxyService,
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

  async createPaymentIntent(orderId:string,deliveryPartnerId:string){
    this.logger.log(`Called payout for deliverypartner: ${JSON.stringify(deliveryPartnerId, null, 2)}`);
    const delivery=await this.deliveryRepo.findOne({
      where:{
        delivery_partner_id:deliveryPartnerId,
        order_id:orderId},
      });
      const stripeId =delivery.delivery_partner.stripe_id;
      const amount = Math.round(delivery.order.amount*100); 
      const commission = Math.round(amount * 0.20);
      const netAmount = amount - commission;

      const paymentIntent = await this.stripe.paymentIntents.create({
      amount:amount,
      currency:'inr',
      payment_method_types:['card'],
      transfer_data:{
        destination:stripeId

      },
      application_fee_amount:commission,
      metadata:{
        order_id:orderId,
        delivery_partner_id:deliveryPartnerId,
        user_id:delivery.order.user_id,
        business_id:delivery.order.business.id
      }

    });
    // Save initial payout record
  await this.payRepo.save({
    order_id: orderId,
    delivery_partner_id: deliveryPartnerId,
    business_id: delivery.order.business.id,
    user_id: delivery.order.user_id,
    amount: amount/100,
    payment_status: 'pending',
    stripe_payment_intent_id: paymentIntent.id,
    commission: commission/100,
    net_amount: netAmount/100
  });

  return {
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id,
  };
}
  
  async createPaymentIntentdonation(amount: number) {
    const platformFee = Math.round(amount * 0.1);
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: "usd",
        application_fee_amount: platformFee,
        transfer_data: {
          destination: "acct_1Ql6RFI6yIQWMWvq", // Replace with your Stripe account ID
        },
        automatic_payment_methods: { enabled: true },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        platformFee,
      };
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }

  async updatePayoutStatus(status: string, paymentIntent:Stripe.PaymentIntent) {
    await this.payRepo.update(
      {stripe_payment_intent_id:paymentIntent.id},
      {payment_status:status,updated_at:new Date()}
    );
    await this.deliveryRepo.update(
      { order_id: paymentIntent.metadata.order_id },
      { order_status: status === 'success' ? 'delivered' : 'in_transit' }
    );

  await this.userProxyService.markDeliveryPartnerUnassigned({
    orderId:paymentIntent.metadata.order_id,
    partnerId:paymentIntent.metadata.delivery_partner_id
  });

  }
}
