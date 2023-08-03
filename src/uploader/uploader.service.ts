import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Uploader } from './entitys/uploader.entity';
import { Repository } from 'typeorm';
import { ReportImages } from 'src/report/entitys/report_images.entity';

@Injectable()
export class UploaderService {
    constructor(
        @InjectRepository(Uploader) private uploaderRepository: Repository<Uploader>,
        @InjectRepository(ReportImages) private reportImagesRepository: Repository<ReportImages>,
    ) { }

    create(link: string) {
        return this.uploaderRepository.save({
            link: link
        })
    }

    findOne(id: number) {
        return this.uploaderRepository.findOne({
            where: { id: id }
        })
    }

    async deleteOne(id: number) {
        console.log(`id del`, id)
        await this.reportImagesRepository.delete({
            image: {
                id: id
            }
        })
        await this.uploaderRepository.delete({
            id: id
        })
    }
}
