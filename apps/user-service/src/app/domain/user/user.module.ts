import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DBModule } from "@fbe/database";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { AuthModule } from "../auth/auth.module";
import { UserEntity } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserAddressService } from "./user.address.service";
import { UserAddressController } from "./user.address.controller";
import { UserAddressEntity } from "./entity/user.address.entity";
import { DeliveryPartnerEntity } from "./entity/delivery-partner.entity";
import { DeliveryPartnerController } from "./delivery.partner.controller";
@Module({
  imports: [
    // most imp
    TypeOrmModule.forFeature([
      UserEntity,
      UserAddressEntity,
      DeliveryPartnerEntity,
    ]),
    AppLoggerModule,
    ConfigModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [
    UserController,
    UserAddressController,
    DeliveryPartnerController,
  ],
  providers: [UserService, UserAddressService],
  exports: [UserService, UserAddressService],
})
export class UserModule {}
