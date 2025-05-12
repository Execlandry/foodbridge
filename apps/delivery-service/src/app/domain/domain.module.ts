import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { DBModule } from "@fbe/database";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryEntity } from "src/app/domain/delivery/entity/delivery.entity";
import { DeliveryController } from "src/app/domain/delivery/controller/delivery.controller";
import { ScheduleModule } from "@nestjs/schedule";
import { DeliveryEventService } from "src/app/domain/delivery/services/delivery-event.service";
import HttpClientService from "src/lib/http.client.service";
import { DeliveryService } from "./delivery/services/delivery.service";
import { UserProxyService } from "./delivery/services/user.http.service";
import {PayoutEntity} from "./payout/entity/payout.entity";
import {PayoutService} from "./payout/services/payout.service";
import {PayoutController } from "./payout/controller/payout.controller";

@Module({
  imports: [
    AuthModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([DeliveryEntity,PayoutEntity]),
    DBModule.forRoot({
      entities: [DeliveryEntity,PayoutEntity],
    }),
    TerminusModule,
    AppLoggerModule,
    ConfigModule,
  ],
  controllers: [DeliveryController,PayoutController],
  providers: [DeliveryService,DeliveryService,
    DeliveryEventService,
    UserProxyService,
    HttpClientService,PayoutService],
  exports: [DeliveryService,PayoutService],
})
export class DomainModule {}
