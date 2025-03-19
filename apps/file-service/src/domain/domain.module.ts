import { Module } from '@nestjs/common';
import { FileModule } from '../domain/files/file.module';
import { AppLoggerModule } from '@fbe/logger';
import { AuthModule } from '../domain/auth/auth.module';
import { ConfigModule } from '@fbe/config';

@Module({
  imports: [FileModule, AuthModule, AppLoggerModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
