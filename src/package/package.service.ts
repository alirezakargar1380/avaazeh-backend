import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entitys/package.entity';
import { Repository } from 'typeorm';
import { JWT_TOKEN } from 'src/authentication/interface/jwt.interface';

@Injectable()
export class PackageService {
    constructor(
        @InjectRepository(Package) private packageRepository: Repository<Package>
    ) { }

    save(user: JWT_TOKEN, data: any) {
        let saveData = {
            ...data,
        }

        if (!user.role.isAdmin) {
            saveData = {
                ...data,
                user: {
                    id: user.id
                }
            }
            console.log(saveData)
        }

        return this.packageRepository.save(saveData)
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
