import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entitys/project.entity';
import { Like, Repository } from 'typeorm';
import { CreateProjectDto, UpdateProjectDto, ProjectDto } from './dto/project.dto';
import { IPagination, pageDetails } from 'src/shared/types/pagination.type';
import { getPagination } from 'src/shared/utils/pagination.utils';
import Exception from 'src/shared/utils/error.utility';
import { IProjectSearchParams } from './interface/project.service.interface';
import { JWT_TOKEN } from 'src/authentication/interface/jwt.interface';
import { ProjectsAcc } from 'src/projects-acc/entitys/projects.acc.entity';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project) private projectRepository: Repository<Project>
    ) { }

    save(data: CreateProjectDto, creatorId: number): Promise<Project> {
        return this.projectRepository.save({
            ...data,
            creator: { id: creatorId }
        })
    }

    async updateById(data: UpdateProjectDto, id: number) {
        if (!await this.findOne(id, {})) throw Exception.setError('this project not found', true)
        await this.projectRepository.update({
            id: id
        }, data)
    }

    findOne(id: number, relations: any): Promise<Project> {
        return this.projectRepository.findOne({
            where: { id: id },
            relations: relations
        })
    }

    findOneWithRelation(id: number): Promise<Project[]> {
        return this.projectRepository.find({
            where: { id: id }, relations: { executiveOrganization: true }
        })
    }

    condition(searchParams: IProjectSearchParams, all_organ_access: boolean, projectAcc: ProjectsAcc, user: JWT_TOKEN) {
        let conditionOption: any = {}

        if (searchParams.project_code) conditionOption.project_code = searchParams.project_code
        if (searchParams.title) conditionOption.title = Like(`%${searchParams.title}%`)
        if (searchParams.location) conditionOption.location = {
            id: Number(searchParams.location)
        }

        if (!projectAcc.get) {
            conditionOption.creator = { id: user.id }
        }

        if (!all_organ_access) {
            conditionOption.executiveOrganization = { id: user.organization }
        } else {
            if (searchParams.executiveOrganization) conditionOption.executiveOrganization = {
                id: Number(searchParams.executiveOrganization)
            }
        }

        return conditionOption
    }

    find(pageDetals: pageDetails, user: JWT_TOKEN, all_organ_access: boolean, searchParams: IProjectSearchParams, projectAcc: ProjectsAcc) {
        let conditionOption: any = this.condition(searchParams, all_organ_access, projectAcc, user)
        
        // if (searchParams.id) conditionOption.id = Number(searchParams.id)
        // if (searchParams.title) conditionOption.title = Like(`%${searchParams.title}%`)

        // if (!projectAcc.get) {
        //     conditionOption.creator = { id: user.id }
        // }

        // if (!all_organ_access) {
        //     conditionOption.executiveOrganization = { id: user.organization }
        // } else {
        //     if (searchParams.executiveOrganization) conditionOption.executiveOrganization = {
        //         id: Number(searchParams.executiveOrganization)
        //     }
        // }

        const pagination: IPagination = getPagination(pageDetals.page, pageDetals.perPage)
        return this.projectRepository.find({
            relations: {
                executiveOrganization: true,
                creator: true,
                cover: true,
                location: true
            },
            where: conditionOption,
            take: pagination.take,
            skip: pagination.skip
        })
    }

    count(user: JWT_TOKEN, all_organ_access: boolean, searchParams: IProjectSearchParams, projectAcc: ProjectsAcc): Promise<number> {
        let conditionOption: any = this.condition(searchParams, all_organ_access, projectAcc, user)

        // if (searchParams.id) conditionOption.id = Number(searchParams.id)
        // if (searchParams.title) conditionOption.title = Like(`%${searchParams.title}%`)
        // if (searchParams._constructor) conditionOption._constructor = Like(`%${searchParams._constructor}%`)

        // if (!projectAcc.get) {
        //     conditionOption.creator = { id: user.id }
        // }

        // if (!all_organ_access) {
        //     conditionOption.executiveOrganization = { id: user.organization }
        // }

        return this.projectRepository.count({
            relations: {
                executiveOrganization: true,
                creator: true,
                cover: true,
                location: true
            },
            where: conditionOption
        })
    }

    delete(id: number): Promise<any> {
        return this.projectRepository.delete({
            id: id
        })
    }
}
