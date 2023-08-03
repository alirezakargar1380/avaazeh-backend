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
        private logsService: LogsService
    ) { }

    async login(username: string, password: string) {
        const user: User | null = await this.usersRepository.findOne({
            where: {
                username: username
            },
            relations: {
                role: true,
                organization: true
            }
        })

        if (user) {
            if (!user.active) throw new Error(loginMessages.active)
        } else {
            throw new Error(loginMessages.usernameOrPassword)
        }

        const passwordCheck: boolean = await bcrypt
            .compare(password, user.password)
            .then(res => {
                console.log("res", res)
                return res
            })

        if (!passwordCheck) {
            this.logsService.addLog({
                action: logsActions.LOGIN_FAILED,
                title: 'پسورد را اشتباه وارد کرد',
                organization: user.organization,
                role: user.role,
                user: user,
                ip: ""
            })
            throw new Error(loginMessages.usernameOrPassword)
        }
        
        if (!user.organization) throw new Error('سازمان کاربر مشخص نیست!')

        await this.logsService.addLog({
            action: logsActions.LOGIN_SCCUSS,
            title: '',
            organization: user.organization,
            role: user.role,
            user: user,
            ip: ""
        })

        const payload: JWT_TOKEN = { id: user.id, roleId: user.role?.id, organization: user.organization?.id }
        return {
            access_token: this.jwtService.sign(payload),
            role: user.role.title,
            fullName: user.fullName,
            organization: user.organization.organization_name,
            organization_id: user.organization.id
        }
    }
}
