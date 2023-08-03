import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsersAccDto } from './dto/usersAcc.dto';
import { UsersAcc } from './entitys/users.acc.entity';

@Injectable()
export class UsersAccService {
    constructor(
        @InjectRepository(UsersAcc) private usersAccRepository: Repository<UsersAcc>
    ) { }

    save(data: CreateUsersAccDto) {
        return this.usersAccRepository.save(data)
    }

    async get(id: number) {
        return await this.usersAccRepository.findOneBy({ role: { id: id } })
    }

    update(data: CreateUsersAccDto, roleId: number) {
        return this.usersAccRepository.update({ role: { id: roleId } }, data)
    }
}
