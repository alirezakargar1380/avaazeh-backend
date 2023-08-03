import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entitys/city.entity';
import { Repository } from 'typeorm';
import { CreateCity } from './dto/city.dto';

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(City) private cityRepository: Repository<City>
    ) { }

    save(data: CreateCity) {
        return this.cityRepository.save(data)
    }

    delete(id: number) {
        return this.cityRepository.delete({
            id: id
        })
    }

    findAll(): Promise<City[]> {
        return this.cityRepository.find({});
    }
}
