// Native.
/* eslint-disable no-useless-escape */

// Package.
import {
  Body,
  Param,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Logger } from "@fbe/logger";
import { CreateAddressDto, UpdateUserByIdDto } from "./dto/user-request.dto";
import { UserSignupResponseDto } from "./dto/user-response.dto";
import { UserAddressService } from "./user.address.service";
import { User, UserMetaData } from "../auth/guards/user";
import { AccessTokenGuard } from "../auth/guards/access_token.guard";

@ApiBearerAuth("authorization")
@Controller("users")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags("users addresses")
export class UserAddressController {
  constructor(
    private readonly service: UserAddressService,
    private readonly logger: Logger
  ) {}

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: "address create api " })
  @ApiConsumes("application/json")
  @Post("/address/:id")
  public async CreateUserAddress(
    @Body() body: CreateAddressDto,
    @Param() param: UpdateUserByIdDto,
    @User() user: UserMetaData
  ) {
    return this.service.create(param, body, user);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "address list api" })
  @ApiConsumes("application/json")
  @Get("/address/:id")
  public async fetchAllAddress(
    @Param() param: UpdateUserByIdDto,
    @User() user: UserMetaData
  ) {
    return this.service.fetchAllAddress(param, user);
  }
}
