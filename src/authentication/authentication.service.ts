import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../users/entitys/users.entity';
import { JwtService } from '@nestjs/jwt';
import { loginMessages } from './constants';
import * as bcrypt from 'bcrypt';
import { JWT_TOKEN } from './interface/jwt.interface';
import { LogsService } from 'src/logs/logs.service';
import logsActions from 'src/shared/constants/logsActions';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private logsService: LogsService,
    ) { }

    async getUserToken(phone: string) {
        const user: User | null = await this.usersRepository.findOne({
            where: {
                phone: phone
            },
            relations: {
                role: true
            }
        })

        if (user) {
            if (!user.active) throw new Error(loginMessages.active)
        } else {
            throw new Error(loginMessages.usernameOrPassword)
        }

        // const passwordCheck: boolean = await bcrypt
        //     .compare(password, user.password)
        //     .then(res => {
        //         console.log("res", res)
        //         return res
        //     })

        // if (!passwordCheck) {
        //     this.logsService.addLog({
        //         action: logsActions.LOGIN_FAILED,
        //         title: 'پسورد را اشتباه وارد کرد',
        //         role: user.role,
        //         user: user,
        //         ip: ""
        //     })
        //     throw new Error(loginMessages.usernameOrPassword)
        // }

        await this.logsService.addLog({
            action: logsActions.LOGIN_SCCUSS,
            title: '',
            role: user.role,
            user: user
        })

        const payload: JWT_TOKEN = { id: user.id, roleId: user.role?.id }
        return {
            access_token: this.jwtService.sign(payload),
            role: user.role.title,
            fullName: user.fullName
        }
    }
}
