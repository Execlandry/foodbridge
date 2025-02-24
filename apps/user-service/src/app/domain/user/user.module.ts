import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DBModule } from "@fbe/database";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { AuthModule } from "../auth/auth.module";
import { UserEntity } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserAddressEntity } from "./entity/user.address.entity";
import { UserAddressController } from "./user.address.controller";
import { UserAddressService } from "./user.address.service";
@Module({
  imports: [
    // most imp
    TypeOrmModule.forFeature([UserEntity,UserAddressEntity]),
    AppLoggerModule,
    ConfigModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, UserAddressController],
  providers: [UserService,UserAddressService],
  exports: [UserService,UserAddressService],
})
export class UserModule {}
