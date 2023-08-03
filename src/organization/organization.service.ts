import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { getPagination } from 'src/shared/utils/pagination.utils';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/organization.dto';
import { Organization } from './entitys/organization.entity';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization) private organizationService: Repository<Organization>
    ) {}

    save(data: CreateOrganizationDto): Promise<Organization> {
        return this.organizationService.save(data)
    }

    find(perPage: number, page: number): Promise<Organization[]> {
        const pagination: IPagination = getPagination(page, perPage)
        return this.organizationService.find({
            take: pagination.take,
            skip: pagination.skip
        })
    }

    delete(id: number): Promise<any> {
        return this.organizationService.delete({
            id: id
        })
    }
}
