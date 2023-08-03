import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entitys/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto, IUpdateRole } from './dto/role.dto';
import paginationHelper from "pagination-helper";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) { }

    save(data: any): Promise<Role> {
        return this.roleRepository.save(data)
    }

    findAll(params): Promise<Role[]> {
        let pagination = new paginationHelper({
            numberOfDataPerPage: Number(params.perPage),
            current_page_number: Number(params.page)
        })
        const skipAndTake: any = pagination.getTakeAndSkip()

        return this.roleRepository.find({
            take: skipAndTake.take,
            skip: skipAndTake.skip
        })
    }

    find(): Promise<Role[]> {
        return this.roleRepository.find()
    }

    count(): Promise<number> {
        return this.roleRepository.count()
    }

    findOneById(id: number): Promise<Role> {
        return this.roleRepository.findOneBy({ id })
    }

    findOneByRole(title: string): Promise<Role> {
        return this.roleRepository.findOneBy({ title })
    }

    update(id: number, data: IUpdateRole) {
        return this.roleRepository.update({ id }, data)
    }
} 
