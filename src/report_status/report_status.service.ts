import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportStatus } from './entitys/reportStatus.entity';
import { IsNull, Repository } from 'typeorm';
import { createReportStatus, IReportStatus } from './dto/report_status.dto';
import p_date from './../shared/utils/persionDate.utility';

@Injectable()
export class ReportStatusService {
    constructor(
        @InjectRepository(ReportStatus) private reportStatusRepository: Repository<ReportStatus>
    ) { }

    create(data: any): Promise<ReportStatus> {
        return this.reportStatusRepository.save({...data, date: p_date.year + "/" + p_date.month + "/" + p_date.day})
    }

    update(id: number, data: any): Promise<any> {
        return this.reportStatusRepository.update({ id }, data)
    }

    findByReportId(reportId: string) {
        return this.reportStatusRepository
            .createQueryBuilder('report_status')//.where('report_status.report = :id', { id: Number(reportId) })
            .leftJoinAndSelect('report_status.reporter', 'reporter').select([
                'report_status.id',
                'report_status.report',
                'report_status.subject',
                'report_status.description',
                'report_status.date',
                'report_status.createdAt',
                'reporter.id',
                'reporter.fullName'
            ])
            .where('report_status.report = :id', { id: Number(reportId) })
            .orderBy('report_status.id', 'DESC')
            .getMany()
    }

    findOne(id: number): Promise<any> {
        return this.reportStatusRepository.findOneBy({ id })
    }
}
