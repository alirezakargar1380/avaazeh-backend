import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entitys/package.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PackageService {
    constructor(
        @InjectRepository(Package) private packageRepository: Repository<Package>
    ) { }

    save(data: any) {
        return this.packageRepository.save(data)
    }

    getAll() {
        return this.packageRepository.find()
    }

    update(id: number, data: any): Promise<any> {
        return this.packageRepository.update({
            id: id
        }, data)
    }
}
