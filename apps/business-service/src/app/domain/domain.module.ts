import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@fbe/config";
import { AppLoggerModule } from "@fbe/logger";
import { DBModule } from "@fbe/database";
import { BusinessAddressEntity } from "./business/entity/business.address.entity";
import { BusinessDishEntity } from "./business/entity/business.dish.entity";
import { BusinessEntity } from "./business/entity/business.entity";
import { BusinessController } from "./business/controller/business.controller";
import { BusinessService } from "./business/services/business.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { BusinessDishService } from "./business/services/business.dish.service";
import { BusinessDishController } from "./business/controller/business.dish.controller";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SearchService } from './search/search.service';
import { SearchModule } from "./search/search.module";


@Module({
  imports: [
    SearchModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([BusinessEntity, BusinessDishEntity]),
    DBModule.forRoot({
      entities: [
        BusinessAddressEntity,
        BusinessEntity,
        BusinessDishEntity,
      ],
    }),
    TerminusModule,
    AppLoggerModule,
    ConfigModule,
  ],

  controllers: [BusinessController, BusinessDishController],
  providers: [BusinessService, BusinessDishService, SearchService],
})
export class DomainModule {}
