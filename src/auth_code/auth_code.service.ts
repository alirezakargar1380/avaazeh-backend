import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from './../users/entitys/users.entity';
import { AuthCode } from './entitys/auth_code.entity';

@Injectable()
export class AuthCodeService {
    constructor(
        @InjectRepository(AuthCode) private authCodeRepository: Repository<AuthCode>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async genAuthCode(phoneNumber: string) {
        // generate code
        const code: number = Math.floor(100000 + Math.random() * 900000)

        const user = await this.userRepository.findOne({
            where: {
                phone: phoneNumber.toString(),
            }
        })

        if (!user) throw new BadRequestException('کاربر مورد نظر یافت نشد')
        if (!user.active) throw new BadRequestException('اکانت شما غیر فعال میباشد')

        await this.authCodeRepository.save({
            code: code.toString(),
            phoneNumber: phoneNumber
        })
        return { authCode: code }
    }

    async verifyAuthCode(phoneNumber: string, code: string) {
        const currentTime = new Date();
        const pastTime = new Date(currentTime.getTime() - 1 * 60000); // 1 min

        const verify = await this.authCodeRepository.findOne({
            where: {
                code: code,
                phoneNumber: phoneNumber.toString(),
                createdAt: MoreThan(pastTime)
            }
        })

        if (!verify) throw new BadRequestException('کد منقضی شده یا اشتباه میباشد')
    }
}
