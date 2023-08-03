import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectStatus } from './entitys/project_status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectStatusService {
    constructor(
        @InjectRepository(ProjectStatus) private projectStatusRepository: Repository<ProjectStatus>
    ) { }

    create(data: any): Promise<ProjectStatus> {
        return this.projectStatusRepository.save(data);
    }

    async delete(id: number) {
        return await this.projectStatusRepository.delete({
            id: id
        })
    }

    find(perPage?: number, page?: number): Promise<ProjectStatus[]> {
        // const pagination: IPagination = getPagination(page, perPage)
        return this.projectStatusRepository.find({
            // take: pagination.take,
            // skip: pagination.skip,
        })
    }
}
