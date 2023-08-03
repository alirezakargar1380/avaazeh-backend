import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Uploader } from './entitys/uploader.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MultiUploaderService {
    constructor(
        @InjectRepository(Uploader) private uploaderRepository: Repository<Uploader>,
    ) {}

    create(links: any): any {
        return this.uploaderRepository.createQueryBuilder().insert().into(Uploader).values(links)
        .execute()
    }

    findMany(ids: any): any {
        return this.uploaderRepository.find({
            where: ids
        })
    }
}
