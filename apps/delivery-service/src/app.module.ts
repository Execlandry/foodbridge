import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";


import { AppLoggerModule } from "@fbe/logger";
import { DomainModule } from "./app/domain/domain.module";
@Module({
  imports: [
    DomainModule,
    TerminusModule,
    AppLoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
