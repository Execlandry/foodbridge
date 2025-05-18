// Native.
/* eslint-disable no-useless-escape */

// Package.
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Res,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { Logger } from "@fbe/logger";
import { Request, Response } from "express";

import { User, UserMetaData } from "../../auth/guards/user";
import { AccessTokenGuard } from "../../auth/guards/access_token.guard";
import { PayoutService } from "../services/payout.service";
import { Stripe } from "stripe";
import { RolesGuard } from "../../auth/guards/role-guard";
import { RoleAllowed } from "../../auth/guards/role-decorator";
import { UserRoles } from "@fbe/types";
@ApiBearerAuth("authorization")
@Controller("payouts")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags("Payout")
export class PayoutController {
  constructor(
    private readonly service: PayoutService,
    private readonly logger: Logger
  ) {}

  @Post('/create-payment-intent/:orderId')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @ApiBearerAuth()
  async createPaymentIntent(
  @User() user: UserMetaData,
  @Param("orderId") orderId: string,
) {
  return this.service.createPaymentIntent(orderId,user.userId);
}

  @Post("/stripe-webhook")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Stripe webhook to trigger payouts" })
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16",
    });

    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const rawBody = (req as any).rawBody;

    if (!rawBody) {
      this.logger.warn("Missing raw body for Stripe webhook verification");
      return res.status(400).send("Raw body missing");
    }

    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );

      // Handle only specific event types
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
        await this.service.updatePayoutStatus(
          'success',
          paymentIntent,
        );
      }
      if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.service.updatePayoutStatus(
          'failed',
          paymentIntent,
        );
      }

      return res.send({ status: "success" });
    } catch (err) {
      this.logger.error(`Stripe webhook error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  @Post("create-payment-intent")
  @ApiOperation({
    summary: "Create a payment intent",
    description: "Create a Stripe payment intent and return client secret.",
  })
  @ApiOkResponse({
    description: "Payment intent created successfully.",
    schema: {
      type: "object",
      properties: {
        clientSecret: { type: "string" },
        platformFee: { type: "number" },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Invalid input data" })
  @HttpCode(HttpStatus.OK)
  async createPaymentIntentdonation(@Body() body: { amount: number }) {
    const { amount } = body;

    if (!amount || amount <= 0) {
      throw new BadRequestException("Amount must be a valid positive number.");
    }

    try {
      const result = await this.service.createPaymentIntentdonation(amount);
      return result;
    } catch (error) {
      throw new BadRequestException(
        `Error creating payment intent: ${error.message || error}`
      );
    }
  }
}
