import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accessbility } from './entitys/accessibility.entity';
import { SettingsAcc } from '../settings-acc/entitys/settings.acc.entity';

@Injectable()
export class AccessibilityService {
    constructor(
        @InjectRepository(Accessbility) private accessibilityRepository: Repository<Accessbility>,
        // @InjectRepository(ReportsAcc) private ReportsAccRepository: Repository<ReportsAcc>,
        // @InjectRepository(LogsAcc) private LogsAccRepository: Repository<LogsAcc>,
        // @InjectRepository(SettingsAcc) private SettingsAccRepository: Repository<SettingsAcc>,
        // @InjectRepository(VariableSettingsAcc) private VariableSettingsAccRepository: Repository<VariableSettingsAcc>,
        // @InjectRepository(RolesAcc) private RolesAccRepository: Repository<RolesAcc>,
        // @InjectRepository(UsersAcc) private UsersAccRepository: Repository<UsersAcc>
    ) { }

    save(data: any) {
        return this.accessibilityRepository.save(data)
    }

    getAccessibilityByRoleId(role_id: number) {
        return this.accessibilityRepository.createQueryBuilder('accessbility').where('accessbility.roleId = :id', { id: role_id }).getOne()
    }

    findAll() {
        return this.accessibilityRepository.find({
            relations: {
                role: true
            }
        })
    }

    async updateAccessiblity(id: number, data: any) {
        return await this.accessibilityRepository.update({
            role: { id: id }
        }, data)
    }

    async findOneAccessiblity(id: number) {
        return await this.accessibilityRepository.findOne({
            where: {
                id: id
            },
            relations: {
                role: true
            }
        })
    }

    async findOneAccessiblityByRoleId(role_id: number) {
        return await this.accessibilityRepository.createQueryBuilder('accessbility')
            .where('accessbility.roleId = :id', { id: role_id })
            .leftJoinAndSelect('accessbility.role', 'role')
            .getOne()
    }
} 
