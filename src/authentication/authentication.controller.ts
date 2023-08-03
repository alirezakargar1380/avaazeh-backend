import { Controller, Post, Body, Res, HttpStatus, Req } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from "./../users/dto/users.dto";
import { AuthenticationService } from "./authentication.service";
import { Response, Request } from 'express';
import { loginMessages } from './constants';
import { JwtService } from '@nestjs/jwt';
import errorMessages from 'src/shared/constants/errorMessages';
import validation from 'src/authentication/validation/auth.validation';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly jwtService: JwtService
    ) { }

    @Post("/login")
    async loginUser(@Req() req: any, @Body() body: LoginUserDto, @Res() res: Response) {
        try {
            validation.login(body)
            res.status(HttpStatus.ACCEPTED).send(await this.authService.login(body.username, body.password))
        } catch (e) {
            console.error(e)
            if (e.message === loginMessages.usernameOrPassword)
                res.status(HttpStatus.METHOD_NOT_ALLOWED).send(loginMessages.usernameOrPassword);
            else if (e.message === loginMessages.active)
                res.status(HttpStatus.METHOD_NOT_ALLOWED).send(loginMessages.active);
            else if (e.isThrow)
                return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Post("/verify")
    async verify_login(@Req() req: Request, @Res() res: Response) {
        try {
            if (!req.headers.authorization) return res.send("you must be logged in")
            let token = req.headers.authorization?.split(' ')[1]

            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })

            res.status(HttpStatus.ACCEPTED).send(decoded)
        } catch (error) {
            if (error.message === "jwt expired") res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.LOGIN_AGAIN)
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

}
