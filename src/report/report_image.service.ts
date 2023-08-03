import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entitys/report.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateReportDto } from './dto/report.dto';
import p_date from '../shared/utils/persionDate.utility';
import { ReportStatus } from 'src/report_status/entitys/reportStatus.entity';
import { IPagination } from 'src/shared/types/pagination.type';
import { getPagination } from 'src/shared/utils/pagination.utils';
import Exception from 'src/shared/utils/error.utility';
import { ReportImages } from './entitys/report_images.entity';

@Injectable()
export class ReportImageService {
    constructor(
        @InjectRepository(ReportImages) private reportImageRepository: Repository<ReportImages>
    ) { }

    find(id: number): Promise<ReportImages[]> { 
        return this.reportImageRepository.find({
            where: { report: {id} },
            relations: { image: true }
        })
    }

    addImages(imagesIds: any, reportId: number) {
        if (!imagesIds.length) return
        const values = []
        imagesIds.forEach((id: number) => values.push({ report: reportId, image: id }))
        console.log(values)
        return this.reportImageRepository.createQueryBuilder().insert().into(ReportImages).values(values)
        .execute()
    }
}