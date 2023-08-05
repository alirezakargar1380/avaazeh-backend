import { Injectable } from '@nestjs/common';
import { FileManager } from './entitys/file_manager.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FileManagerService {
    constructor(
        @InjectRepository(FileManager) private fileManagerRepository: Repository<FileManager>
    ) { }

    // async save(data: any) {
    //     return this.fileManagerRepository.save({})
    // }

    async insertMulti(data: any) {
        return this.fileManagerRepository.createQueryBuilder().insert().into(FileManager).values(data)
            .execute()
    }

    async findAll() {
        return this.fileManagerRepository.find({
            where: {
                belongsTo: {
                    id: 1
                }
            },
            relations: {
                belongsTo: true,
                file: true
            }
        })
    }
}
