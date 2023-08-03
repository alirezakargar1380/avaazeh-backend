import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialCreditSources } from './entitys/financial_credit_sources.entity';

@Injectable()
export class FinancialCreditSourcesService {
    constructor(
        @InjectRepository(FinancialCreditSources) private financialCreditSourceRepository: Repository<FinancialCreditSources>
    ) { }

    save(data: any): Promise<FinancialCreditSources> {
        return this.financialCreditSourceRepository.save(data)
    }

    find(): Promise<FinancialCreditSources[]> {
        return this.financialCreditSourceRepository.find()
    }
}
