import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import { DeliveryService } from "../services/delivery.service";
import { AccessTokenGuard } from "../../auth/guards/access_token.guard";
import { RolesGuard } from "../../auth/guards/role-guard";
import { RoleAllowed } from "../../auth/guards/role-decorator";
import { UserRoles } from "@fbe/types";
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { User, UserMetaData } from "../../auth/guards/user";
import { LocationDto, VerifyOtpDto } from "../dto/update-current-location.dto";

@ApiBearerAuth("authorization")
@Controller("delivery")
export class DeliveryController {
  constructor(
    private readonly health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private readonly service: DeliveryService
  ) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @Patch("/current-location")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update current location of delivery partner during pickup",
  })
  @ApiOkResponse({
    description: "Successfully updated current location",
    schema: {
      example: {
        currentLocation: {
          lat: 15.2993,
          lng: 74.124,
        },
      },
    },
  })
  @ApiBody({ type: LocationDto })
  public async updateCurrentLocation(
    @User() user: UserMetaData,
    @Body() dto: LocationDto
  ) {
    return await this.service.updateCurrentLocation(user.userId, dto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @Patch("/verify-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update otp verified field during pickup",
  })
  @ApiOkResponse({
    description: "OTP verified successfully",
  })
  // @ApiBody({ type: LocationDto })
  public async setOtpVerified(
    @User() user: UserMetaData,
    @Body() body: VerifyOtpDto
  ) {
    return await this.service.setOtpVerified(user.userId, body.otp);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @HttpCode(HttpStatus.OK)
  @Get("/order-otp-status")
  @ApiOperation({
    summary: "Check if OTP is already verified for the assigned order",
  })
  @ApiOkResponse({
    description: "Returns the OTP verification status for the delivery partner",
    schema: {
      example: {
        is_otp_verified: true,
      },
    },
  })
  public async getOrderOtpStatus(@User() user: UserMetaData) {
    return await this.service.getOrderOtpStatus(user.userId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @HttpCode(HttpStatus.OK)
  @Get("/available-orders")
  @ApiOperation({ summary: "Get available orders for delivery partners" })
  @ApiOkResponse({ description: "Returns list of unassigned orders" })
  public async getAvailableOrdersForDelivery() {
    return await this.service.getAvailableOrdersForDelivery();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @HttpCode(HttpStatus.OK)
  @Get("/current-orders")
  @ApiOperation({
    summary: "Get currently assigned orders for delivery partners",
  })
  @ApiOkResponse({ description: "Returns currently assigned orders" })
  public async getCurrentOrdersForDeliveryPartner(@User() user: UserMetaData) {
    return await this.service.getCurrentOrdersForDeliveryPartner(user.userId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @HttpCode(HttpStatus.OK)
  @Get("/order-history")
  @ApiOperation({
    summary: "Get Delivery of orders history for delivery partners",
  })
  @ApiOkResponse({ description: "Returns orders history of delivery partner" })
  public async getOrderWithSuccessfulPayout(@User() user: UserMetaData) {
    return await this.service.getOrderWithSuccessfulPayout(user.userId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @HttpCode(HttpStatus.OK)
  @Post("/accept/:orderId")
  @ApiOperation({ summary: "Accept an available order manually" })
  @ApiOkResponse({
    description: "Order successfully assigned to delivery partner",
  })
  @ApiNotFoundResponse({ description: "Order not found" })
  @ApiForbiddenResponse({ description: "Partner not available" })
  @ApiInternalServerErrorResponse({ description: "Assignment failed" })
  @ApiBearerAuth()
  public async assignOrder(
    @Param("orderId") orderId: string,
    @User() user: UserMetaData
  ) {
    return this.service.assignOrder(orderId, user.userId);
  }

  //refer the delivery-service
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @RoleAllowed(UserRoles["delivery-partner"])
  // @HttpCode(HttpStatus.OK)
  // @Post("/confirm-delivery/:orderId")
  // @ApiOperation({ summary: "Confirm a delivery" })
  // @ApiOkResponse({ description: "Order delivered success" })
  // @ApiNotFoundResponse({ description: "Order not found" })
  // @ApiForbiddenResponse({ description: "Partner not available" })
  // @ApiInternalServerErrorResponse({ description: "Assignment failed" })
  // @ApiBearerAuth()
  // public async confirmDelivery(
  //   @Param("orderId") orderId: string,
  //   @User() user: UserMetaData
  // ) {
  //   return this.service.confirmDelivery(orderId, user.userId);
  // }

  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @RoleAllowed(UserRoles["delivery-partner"])
  @HttpCode(HttpStatus.OK)
  @Get("/fetchOrder/:orderId")
  @ApiForbiddenResponse({ description: "Partner not available" })
  @ApiInternalServerErrorResponse({ description: "Assignment failed" })
  public async fetchOrderById(@Param("orderId") orderId: string) {
    return this.service.fetchOrderById(orderId);
  }

  @EventPattern("order_processed_success")
  async handleEventForOrder(data: Record<string, unknown>) {
    // access db table
    await this.service.registerDeliveryAssignTask(data);
    // get order
    // and assign user (delivery partner) from database to this order
  }
}
