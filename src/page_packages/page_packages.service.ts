import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagePackage } from './entitys/page_package.entity';

@Injectable()
export class PagePackagesService {
    constructor(
        @InjectRepository(PagePackage) private repo: Repository<PagePackage>
    ) { }

    add(data: any) {
        return this.repo.save(data)
    }
}
