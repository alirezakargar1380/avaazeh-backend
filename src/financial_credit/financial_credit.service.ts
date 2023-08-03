import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialCredit } from './entitys/financial_credit.entity';
import p_date from 'src/shared/utils/persionDate.utility';
import persionDateUtility from 'src/shared/utils/persionDate.utility';
import { financialCreditChart } from './entitys/financial_credit.dto';

@Injectable()
export class FinancialCreditService {
    constructor(
        @InjectRepository(FinancialCredit) private financialCreditRepository: Repository<FinancialCredit>
    ) { }

    async get_sum(): Promise<financialCreditChart[]> {
        return await this.financialCreditRepository
            .createQueryBuilder('financial_credit')
            .select('SUM(financial_credit.amount) AS numberOfReports')
            .addSelect('financial_credit.month')
            .where(`financial_credit.year = ${persionDateUtility.year}`)
            .groupBy('financial_credit.month')
            .getRawMany()
    }

    save(data: any, projectId: number): Promise<FinancialCredit> {
        return this.financialCreditRepository.save({
            ...data,
            project: projectId,
            date: p_date.year + "/" + p_date.month + "/" + p_date.day,
            year: p_date.year,
            month: p_date.month
        })
    }

    delete(id: number) {
        return this.financialCreditRepository.delete({
            id: id
        })
    }

    find(projectId: number): Promise<FinancialCredit[]> {
        return this.financialCreditRepository.find({
            where: {
                project: {
                    id: projectId
                }
            },
            relations: {
                source: true
            }
        })
    }

    sum_all(): Promise<number> {
        return this.financialCreditRepository
            .createQueryBuilder("financial_credit")
            .select('SUM(financial_credit.amount)', 'sum')
            .getRawOne()
    }
}
