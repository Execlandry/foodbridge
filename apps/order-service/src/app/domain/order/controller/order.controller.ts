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
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { Logger } from "@fbe/logger";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NO_ENTITY_FOUND,
  UNAUTHORIZED_REQUEST,
} from "src/app/app.constants";
import {
  CreatePaymentBodyDto,
  UpdateByIdDto} from "../dto/order.dto";
import { User, UserMetaData } from "../../auth/guards/user";
import { AccessTokenGuard } from "../../auth/guards/access_token.guard";
import { OrderService } from "../services/order.service";


@ApiBearerAuth("authorization")
@Controller("order")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags("orders")
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly logger: Logger
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @UseGuards(AccessTokenGuard)
  @Post("/")
  public async createOrder(
    @User() user: UserMetaData,
    @Body() payload: CreatePaymentBodyDto
  ) {
    console.log(user);
    return await this.orderService.createOrder(user, payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @UseGuards(AccessTokenGuard)
  @Get(":id/otp")
  public async confirmOrder(
    @User() user: UserMetaData,
    @Param() param: UpdateByIdDto,
    // @Query() query: UpdateByIdQueryDto
  ) {
    return await this.orderService.getOrderOtp(param);
    // return await this.orderService.confirmOrderPayment(user, param, query);
  }

//   @Get(':id/otp')
// async getOrderOtp(@Param('id') id: string): Promise<{ otp: string }> {
//   const order = await this.orderService
//   if (!order) throw new NotFoundException('Order not found');

//   return { otp: order.otp! }; // You may want to restrict this to delivery personnel/admins only
// }

  // @HttpCode(HttpStatus.OK)
  // @ApiConsumes("application/json")
  // @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  // @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  // @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  // @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  // @UseGuards(AccessTokenGuard)
  // @Get("/test")
  // public async testRMQ(@User() user: UserMetaData) {
  //   return await this.orderService.testRMQ();
  // }
}
