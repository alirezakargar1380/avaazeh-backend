import { Module } from '@nestjs/common';
import { LogsAccService } from './logs-acc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsAcc } from './entitys/logs.acc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LogsAcc
    ]),
  ],
  providers: [LogsAccService]
})
export class LogsAccModule {}
