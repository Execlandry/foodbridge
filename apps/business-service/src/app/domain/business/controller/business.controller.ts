// Native.
/* eslint-disable no-useless-escape */

// Package.
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { createBusinessBodyDto, SearchQueryDto } from "../dto/business.dto";
import { User, UserMetaData } from "../../auth/guards/user";
import { RolesGuard } from "../../auth/guards/role-guard";
import { UserRoles } from "@fbe/types";
import { RoleAllowed } from "../../auth/guards/role-decorator";

@ApiBearerAuth("authorization")
@Controller("businesses")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags("business")
export class BusinessController {
  constructor(
    private readonly service: BusinessService,
    private readonly logger: Logger
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    description: "search businesses based on lat/lon",
  })
  @ApiOkResponse({
    description: "return search businesses successfully",
  })
  @Get("/search")
  public async searchBusiness(@Query() query: SearchQueryDto) {
    return await this.service.search(query);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes("application/json")
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    description: "search businesses based on lat/lon",
  })
  @ApiOkResponse({
    description: "return search businesses successfully",
  })
  @RoleAllowed(UserRoles["business-admin"])
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post("/")
  public async createBusiness(
    @User() user: UserMetaData,
    @Body() payload: createBusinessBodyDto
  ) {
    return await this.service.createBusiness(user, payload);
  }
}
