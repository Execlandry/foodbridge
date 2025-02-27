import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { DBModule } from "@fbe/database";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { CartEntity } from "./order/entity/cart.entity";
import { CartController } from "./order/controller/cart.controller";
import { CartService } from "./order/services/cart.service";



@Module({
  imports: [
    AuthModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([CartEntity]),
    DBModule.forRoot({
      entities: [
        CartEntity
      ],
    }),
    TerminusModule,
    AppLoggerModule,
    ConfigModule,
  ],

  controllers: [CartController],
  providers: [CartService],
})
export class DomainModule {}
