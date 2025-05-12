import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { DBModule } from "@fbe/database";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthModule } from "./auth/auth.module";
import { OrderEntity } from "./order/entity/order.entity";
import { OrderController } from "./order/controller/order.controller";
import { OrderService } from "./order/services/order.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "ORDER_LISTENER_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://guest:guest@localhost:5672/admin"],
          queue: "order-messages",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    AuthModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([OrderEntity]),//PaymentEntity
    DBModule.forRoot({
      entities: [OrderEntity],//PaymentEntity
    }),
    TerminusModule,
    AppLoggerModule,
    ConfigModule,
  ],

  controllers: [OrderController],//PaymentController
  providers: [OrderService],//PaymentService
  exports: [OrderService]//PaymentService
})
export class DomainModule {}
