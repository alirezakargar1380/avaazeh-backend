import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReportsAcc } from 'src/reports-acc/entitys/reports.acc.entity';
import { CreateReportAccDto } from './dto/reportAcc.dto.interface';

@Injectable()
export class ReportsAccService {
    constructor(
        @InjectRepository(ReportsAcc) private reprotsAccRepository: Repository<ReportsAcc>
    ) { }

    save(data: CreateReportAccDto) {
        return this.reprotsAccRepository.save(data)
    }

    async get(id: number) {
        return await this.reprotsAccRepository.findOneBy({ role: { id: id } })
    }

    update(data: CreateReportAccDto, roleId: number) {
        return this.reprotsAccRepository.update({ role: { id: roleId } }, data)
    }
}
