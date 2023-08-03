import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogsAccDto } from './dto/logs.acc.dto.entity';
import { LogsAcc } from './entitys/logs.acc.entity';

@Injectable()
export class LogsAccService {
    constructor(
        @InjectRepository(LogsAcc) private logsAccRepository: Repository<LogsAcc>
    ) { }

    save(data: CreateLogsAccDto) {
        return this.logsAccRepository.save(data)
    }

    async get(id: number) {
        return await this.logsAccRepository.findOneBy({ role: { id: id } })
    }

    update(data: CreateLogsAccDto, roleId: number) {
        return this.logsAccRepository.update({ role: { id: roleId } }, data)
    }
}
