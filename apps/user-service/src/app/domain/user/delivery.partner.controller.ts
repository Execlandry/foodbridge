// Native.
/* eslint-disable no-useless-escape */

// Package.
import { Request, Response } from "express";
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
  BadRequestException,
  Put,
  RawBodyRequest,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import Stripe from "stripe";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { Logger } from "@fbe/logger";
import { AccessTokenGuard } from "../auth/guards/access_token.guard";
import {
  DeliveryPartnerSignupDto,
  FullPartnerDetailsDto,
  GetDeliveryPartnerAvailability,
  GetDeliveryPartnerbyId,
  PartnerResponseDto,
} from "./dto/user-request.dto";
import { UserService } from "./user.service";
import { RolesGuard } from "../auth/guards/role-guard";
import { UserRoles } from "@fbe/types";
import { RoleAllowed } from "../auth/guards/role-decorator";
@ApiBearerAuth("authorization")
@Controller("partners")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags("partners")
export class DeliveryPartnerController {
  constructor(
    private readonly service: UserService,
    private readonly logger: Logger
  ) {}

  @Post("register")
  @ApiOperation({
    summary: "Register delivery partners",
    description: "Register a new delivery partner",
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "Delivery partner registered successfully",
    type: PartnerResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid partner data" })
  @ApiConflictResponse({ description: "Partner already exists" })
  @ApiInternalServerErrorResponse({ description: "Server error" })
  public async registerDeliveryPartner(@Body() body: DeliveryPartnerSignupDto) {
    return this.service.registerDeliveryPartner(body);
  }

  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @RoleAllowed(UserRoles["delivery-partner"])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: FullPartnerDetailsDto, description: "" })
  @ApiOperation({
    summary: "Get current available partner",
    description: "return available delivery partner",
  })
  @ApiConsumes("application/json")
  @Get(":id")
  public async fetchRequestedPartnerDetails(
    @Param() param: GetDeliveryPartnerbyId
  ) {
    return this.service.fetchRequestedPartnerDetails(param);
  }

  @Put(":id/availability")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: PartnerResponseDto,
    description: "Partner availability updated to true successfully",
  })
  @ApiParam({
    name: "delivery_partner_id",
    description: "User ID of the delivery partner",
    type: "string",
    required: true,
  })
  public async updatePartnerAvailability(
    @Param() param: GetDeliveryPartnerbyId,
    @Body() body: GetDeliveryPartnerAvailability
  ) {
    return this.service.updatePartnerAvailability(param, body);
  }

  @Put(":id/release")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: PartnerResponseDto,
    description: "Partner availability updated to false successfully",
  })
  @ApiParam({
    name: "delivery_partner_id",
    description: "User ID of the delivery partner",
    type: "string",
    required: true,
  })
  async updateReleasePartnerAvailability(
    @Param() param: GetDeliveryPartnerbyId,
    @Body() body: GetDeliveryPartnerAvailability
  ) {
    return this.service.updateReleasePartnerAvailability(param, body);
  }

  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16",
    });
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const rawBody = (req as any).rawBody;

    if (!rawBody) {
      return res.status(400).send("Raw body missing");
    }

    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
      // ... call your service
      await this.service.handleStripeWebhook(event);
      res.send({ received: true });
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
