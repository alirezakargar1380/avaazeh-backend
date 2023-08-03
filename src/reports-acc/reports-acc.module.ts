import { Module } from '@nestjs/common';
import { ReportsAccService } from './reports-acc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsAcc } from 'src/reports-acc/entitys/reports.acc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportsAcc
    ])
  ],
  providers: [ReportsAccService]
})
export class ReportsAccModule {}
