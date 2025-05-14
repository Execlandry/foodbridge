import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { DBModule } from "@fbe/database";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryEntity } from "src/app/domain/delivery/entity/delivery.entity";
import { PayoutEntity } from "src/app/domain/payout/entity/payout.entity";
import { DeliveryController } from "src/app/domain/delivery/controller/delivery.controller";
import { PayoutController } from "src/app/domain/payout/controller/payout.controller";
import { ScheduleModule } from "@nestjs/schedule";
import HttpClientService from "src/lib/http.client.service";
import { DeliveryService } from "./delivery/services/delivery.service";
import { PayoutService } from "./payout/services/payout.service";
import { UserProxyService } from "./delivery/services/user.http.service";
import { LocationModule } from "./location/location.module";

@Module({
  imports: [
    LocationModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([DeliveryEntity, PayoutEntity]),
    DBModule.forRoot({
      entities: [DeliveryEntity, PayoutEntity],
    }),
    TerminusModule,
    AppLoggerModule,
    ConfigModule,
  ],
  controllers: [DeliveryController, PayoutController],
  providers: [
    DeliveryService,
    DeliveryService,
    PayoutService,
    UserProxyService,
    HttpClientService,
  ],
  exports: [DeliveryService, PayoutService],
})
export class DomainModule {}
