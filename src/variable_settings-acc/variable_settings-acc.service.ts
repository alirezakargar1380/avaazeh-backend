import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVariableSettingsAccDto } from './dto/variableSettingsAcc.dto';
import { VariableSettingsAcc } from './entitys/variable_settings.acc.entity';

@Injectable()
export class VariableSettingsAccService {
    constructor(
        @InjectRepository(VariableSettingsAcc) private variableSettingsAccRepository: Repository<VariableSettingsAcc>
    ) { }

    save(data: CreateVariableSettingsAccDto) {
        return this.variableSettingsAccRepository.save(data)
    }

    async get(id: number) {
        return await this.variableSettingsAccRepository.findOneBy({ role: { id: id } })
    }

    update(data: CreateVariableSettingsAccDto, roleId: number) {
        return this.variableSettingsAccRepository.update({ role: { id: roleId } }, data)
    }
}
