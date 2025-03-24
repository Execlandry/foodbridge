// Native.
/* eslint-disable no-useless-escape */

// Package.
import {
  Body,
  Controller,
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
import { CartService } from "../services/cart.service";
import { Type } from "class-transformer";
import {
  CreateBusinessBodyDto,
  SearchQueryDto,
  UpdateBusinessBodyDto,
  fetchBusinessByIdDto,
} from "../dto/cart.dto";
import { User, UserMetaData } from "../../auth/guards/user";
import { RolesGuard } from "../../auth/guards/role-guard";
import { UserRoles } from "@fbe/types";
import { RoleAllowed } from "../../auth/guards/role-decorator";

@ApiBearerAuth("authorization")
@Controller("cart")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags("cart")
export class CartController {
  constructor(
    private readonly service: CartService,
    private readonly logger: Logger
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    description: "search delivery based on lat/lon",
  })
  @ApiOkResponse({
    description: "return search delivery successfully",
  })
  @RoleAllowed(UserRoles["business-admin"])
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post("/")
  public async createBusiness(
    @User() user: UserMetaData,
    @Body() payload: CreateBusinessBodyDto
  ) {
    return await this.service.createBusiness(user, payload);
  }
}
