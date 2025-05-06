import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { DBModule } from "@fbe/database";

import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { CartEntity } from "./cart/entity/cart.entity";
import { CartController } from "./cart/controller/cart.controller";
import { CartService } from "./cart/services/cart.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    AuthModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([CartEntity]),
    DBModule.forRoot({
      entities: [CartEntity],
    }),
    TerminusModule,
    AppLoggerModule,
    ConfigModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class DomainModule {}
