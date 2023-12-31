import { Controller, Post, Body, Res, HttpStatus, Req } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from "./../users/dto/users.dto";
import { AuthenticationService } from "./authentication.service";
import { Response, Request } from 'express';
import { loginMessages } from './constants';
import { JwtService } from '@nestjs/jwt';
import errorMessages from 'src/shared/constants/errorMessages';
import validation from 'src/authentication/validation/auth.validation';
import { error_response } from 'src/shared/response/response';
import { AuthCodeService } from 'src/auth_code/auth_code.service';
import { UsersService } from 'src/users/users.service';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entitys/role.entity';
import { User } from 'src/users/entitys/users.entity';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        private readonly roleService: RoleService,
        private readonly authCodeService: AuthCodeService
    ) { }

    @Post('/register')
    async addUser(@Req() req: any, @Body() body: CreateUserDto, @Res() res: Response) {
        try {
            // validation.userData(body)

            const role: Role = await this.roleService.findOneById(body.role)
            if (!role) throw new Error('این نقش انتخاب شده وجود ندارد')

            const createdUser: User = await this.userService.save(body)
            res.status(HttpStatus.CREATED).send(createdUser);

        } catch (e) {
            error_response(e, res)
        }
    }

    @Post("/login")
    async loginUser(@Req() req: any, @Body() body: LoginUserDto, @Res() res: Response) {
        try {
            validation.login(body)
            res.status(HttpStatus.ACCEPTED).send(await this.authCodeService.genAuthCode(body.phone))
            // res.status(HttpStatus.ACCEPTED).send(await this.authService.getUserToken(body.phone))
        } catch (e) {
            error_response(e, res)
        }
    }

    @Post("/verify")
    async verify_login(@Body() body: any, @Req() req: Request, @Res() res: Response) {
        try {
            validation.verify(body)
            // if (!req.headers.authorization) return res.send("you must be logged in")
            // let token = req.headers.authorization?.split(' ')[1]
            const user = await this.userService.findOne({ phone: body.phone })
            if (user.active === null) await this.userService.update(user.id, { active: true })
            // const decoded = this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })
            await this.authCodeService.verifyAuthCode(body.phone, body.code)


            res.status(HttpStatus.ACCEPTED).send(
                await this.authService.getUserToken(body.phone)
            )
        } catch (e) {
            error_response(e, res)
        }
    }

}
