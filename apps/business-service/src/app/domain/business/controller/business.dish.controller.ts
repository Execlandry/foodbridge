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
import { AccessTokenGuard } from "../../auth/guards/access_token.guard";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NO_ENTITY_FOUND,
  UNAUTHORIZED_REQUEST,
} from "src/app/app.constants";
import { BusinessService } from "../services/business.service";
import { Type } from "class-transformer";
import { CreateBusinessBodyDto, SearchQueryDto } from "../dto/business.dto";
import { User, UserMetaData } from "../../auth/guards/user";
import { RolesGuard } from "../../auth/guards/role-guard";
import { UserRoles } from "@fbe/types";
import { RoleAllowed } from "../../auth/guards/role-decorator";
import {
  createBusinessDishBodyDto,
  BusinessParamParamDto,
  UpdateDishItemParamDto,
  UpdateBusinessDishBodyDto,
} from "../dto/business.dish.dto";
import { BusinessDishService } from "../services/business.dish.service";

@ApiBearerAuth("authorization")
@Controller("businesses")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags("business-dish")
export class BusinessDishController {
  constructor(
    private readonly service: BusinessDishService,
    private readonly logger: Logger
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    description: "create a DISH for business",
  })
  @ApiCreatedResponse({
    description: "dish for business created successfully",
  })
  @RoleAllowed(UserRoles["business-admin"])
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post("/:id/dish")
  public async createDish(
    @User() user: UserMetaData,
    @Param() param: BusinessParamParamDto,
    @Body() payload: createBusinessDishBodyDto
  ) {
    return await this.service.createDish(user, param, payload);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    description: "update a Dish for business",
  })
  @ApiCreatedResponse({
    description: "dish for business updated successfully",
  })
  @RoleAllowed(UserRoles["business-admin"])
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Put("/:id/dish/:dish_id")
  public async updateDish(
    @User() user: UserMetaData,
    @Param() param: UpdateDishItemParamDto,
    @Body() payload: UpdateBusinessDishBodyDto
  ) {
    return await this.service.updateDish(user, param, payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    description: "fetch all dishes from business",
  })
  @UseGuards(AccessTokenGuard)
  @Get("/:id")
  public async fetchDishes(
    @User() user: UserMetaData,
    @Param() param: BusinessParamParamDto
  ) {
    return await this.service.getAllDishByBusiness(user, param);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    description: "delete a dish from business menu",
  })
  @RoleAllowed(UserRoles["business-admin"])
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete("/:id/dish/:dish_id")
  public async deleteDishes(
    @User() user: UserMetaData,
    @Param() param: UpdateDishItemParamDto
  ) {
    return await this.service.deleteDish(user, param);
  }
}
