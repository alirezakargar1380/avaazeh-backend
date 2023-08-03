import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSettingsAccDto } from './dto/settings.acc.dto';
import { SettingsAcc } from './entitys/settings.acc.entity';

@Injectable()
export class SettingsAccService {
    constructor(
        @InjectRepository(SettingsAcc) private settingsAccRepository: Repository<SettingsAcc>
    ) { }

    save(data: CreateSettingsAccDto) {
        return this.settingsAccRepository.save(data)
    }

    async get(id: number) {
        return await this.settingsAccRepository.findOneBy({ role: { id: id } })
    }

    update(data: CreateSettingsAccDto, roleId: number) {
        return this.settingsAccRepository.update({ role: { id: roleId } }, data)
    }
}
