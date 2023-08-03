import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleAccDto } from './dto/role.acc.dto';
import { RolesAcc } from './entitys/roles.acc.entity';

@Injectable()
export class RoleAccService {
    constructor(
        @InjectRepository(RolesAcc) private rolesAccRepository: Repository<RolesAcc>
    ) { }

    save(data: CreateRoleAccDto) {
        return this.rolesAccRepository.save(data)
    }

    async get(id: number) {
        return await this.rolesAccRepository.findOneBy({ role: { id: id } })
    }

    update(data: CreateRoleAccDto, roleId: number) {
        return this.rolesAccRepository.update({ role: { id: roleId } }, data)
    }
}
