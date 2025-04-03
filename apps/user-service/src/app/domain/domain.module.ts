import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { DBModule } from "@fbe/database";
import { AuthModule } from "./auth/auth.module";
import { UserEntity } from "./user/entity/user.entity";
import { UserModule } from "./user/user.module";
import { UserAddressEntity } from "./user/entity/user.address.entity";
import { DeliveryPartnerEntity } from "./user/entity/delivery-partner.entity";
@Module({
  imports: [
    DBModule.forRoot({
      entities: [UserEntity, UserAddressEntity, DeliveryPartnerEntity],
    }),
    UserModule,
    AuthModule,
    TerminusModule,
    AppLoggerModule,
    ConfigModule,
  ],

  controllers: [],
  providers: [],
})
export class DomainModule {}
