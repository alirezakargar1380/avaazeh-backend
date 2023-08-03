import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialCredit } from './entitys/financial_credit.entity';
import { FinancialCreditController } from './financial_credit.controller';
import { FinancialCreditService } from './financial_credit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialCredit])
  ],
  controllers: [FinancialCreditController],
  providers: [FinancialCreditService]
})
export class FinancialCreditModule {}
