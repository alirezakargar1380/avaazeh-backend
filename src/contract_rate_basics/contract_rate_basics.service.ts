import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractRateBasics } from './entitys/ContractRateBasics.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContractRateBasicsService {
    constructor(
        @InjectRepository(ContractRateBasics) private cRBRepository: Repository<ContractRateBasics>
    ) { }

    create(data: any): Promise<ContractRateBasics> {
        return this.cRBRepository.save(data);
    }

    async delete(id: number) {
        return await this.cRBRepository.delete({
            id: id
        })
    }

    findAll(): Promise<ContractRateBasics[]> {
        return this.cRBRepository.find();
    }
}
