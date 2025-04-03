import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { AppLoggerModule } from '@fbe/logger';
import FileDaoService from './file.dao.service';
import { FileService } from './file.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@fbe/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [FileController],
  providers: [FileService, FileDaoService],
  exports: [FileService, FileDaoService],
})
export class FileModule {}
