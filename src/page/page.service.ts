import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entitys/page.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page) private pageRepo: Repository<Page>
    ) { }

    async getPage(user: any): Promise<Page[]> {
        return this.pageRepo.find({
            where: {
                user: { id: user.id }
            },
            relations: {
                // belongsTo: true,
                package: true,
                user: true
            }
        })
    }

    async addPage(data: any, user: any): Promise<Page> {
        return this.pageRepo.save({ ...data, user: user.id })
    }

    update(id: number, data: any, user: any): Promise<any> {
        return this.pageRepo.update({
            id: id
        }, {
            ...data, user: user.id
        })
    }
}
