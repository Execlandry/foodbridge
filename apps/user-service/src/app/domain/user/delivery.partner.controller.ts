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
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
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
    description: "Partner availability updated successfully",
  })
  @ApiParam({
    name: "id",
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
  @ApiOperation({ summary: "Release partner for new orders" })
  async releasePartner(@Param() param: GetDeliveryPartnerbyId) {
    return this.service.updatePartnerAvailability(param, {
      availability: true,
    });
  }
}
