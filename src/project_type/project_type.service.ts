import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectType } from './entitys/projectType.entity';

@Injectable()
export class ProjectTypeService {
    constructor(
        @InjectRepository(ProjectType) private projectTypeRepository: Repository<ProjectType>,
    ) {}

    create(data: any) {
        return this.projectTypeRepository.save(data);
    }

    async delete(id: number) {
        return await this.projectTypeRepository.delete({
            id: id
        })
    }

    findAll() {
        return this.projectTypeRepository.find();
    }
}
