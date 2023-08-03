import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectsAcc } from '../projects-acc/entitys/projects.acc.entity';
import { CreateProjectAccDto } from './dto/projectsAcc.dto.interface';

@Injectable()
export class ProjectsAccService {
    constructor(
        @InjectRepository(ProjectsAcc) private projectsAccRepository: Repository<ProjectsAcc>
    ) { }

    save(data: CreateProjectAccDto) {
        return this.projectsAccRepository.save(data)
    }

    async get(id: number) {
        return await this.projectsAccRepository.findOneBy({ role: { id: id } })
    }

    update(data: CreateProjectAccDto, roleId: number) {
        return this.projectsAccRepository.update({ role: { id: roleId } }, data)
    }
}
