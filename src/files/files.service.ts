import { Injectable } from '@nestjs/common';
import { Files } from './entitys/files.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(Files) private filesRepository: Repository<Files>
    ) { }

    async save(data: any) {
        return this.filesRepository.save(data)
    }

    async insertMulti(data: any) {
        return this.filesRepository.createQueryBuilder().insert().into(Files).values(data)
            .execute()
    }
}
