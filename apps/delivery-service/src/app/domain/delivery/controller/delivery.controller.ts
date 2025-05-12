import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { User, UserMetaData } from "../../auth/guards/user";

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
  @HttpCode(HttpStatus.OK)
  @Get("/available-orders")
  @ApiOperation({ summary: "Get available orders for delivery partners" })
  @ApiOkResponse({ description: "Returns list of unassigned orders" })
  public async getAvailableOrdersForDelivery(@User() user: UserMetaData) {
    return await this.service.getAvailableOrdersForDelivery();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles["delivery-partner"])
  @HttpCode(HttpStatus.OK)
  @Get("/current-orders")
  @ApiOperation({ summary: "Get available orders for delivery partners" })
  @ApiOkResponse({ description: "Returns list of unassigned orders" })
  public async getCurrentOrdersForDeliveryPartner(@User() user: UserMetaData) {
    return await this.service.getCurrentOrdersForDeliveryPartner(user.userId);
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
  public async acceptOrder(
    @Param("orderId") orderId: string,
    @User() user: UserMetaData
  ) {
    return this.service.assignOrder(orderId, user.userId);
  }

  @EventPattern("order_processed_success")
  async handleEventForOrder(data: Record<string, unknown>) {
    // access db table
    await this.service.registerDeliveryAssignTask(data);
    // get order
    // and assign user (delivery partner) from database to this order
  }
}
