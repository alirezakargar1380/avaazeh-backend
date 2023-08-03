import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './entitys/settings.entitys';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Settings) private settingsRepository: Repository<Settings>,
    ) { }

    getSetting() {
        return this.settingsRepository.findOne({ where: { id: 1 } })
    }

    update(data: any) {
        return this.settingsRepository.update(1, data)
    }
}
