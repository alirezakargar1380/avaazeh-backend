import { Module } from '@nestjs/common';
import { ContractRateBasicsController } from './contract_rate_basics.controller';
import { ContractRateBasicsService } from './contract_rate_basics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractRateBasics } from './entitys/ContractRateBasics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractRateBasics])
  ],
  controllers: [ContractRateBasicsController],
  providers: [ContractRateBasicsService]
})
export class ContractRateBasicsModule {}
