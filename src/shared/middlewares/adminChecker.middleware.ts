import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import errorMessages from './../constants/errorMessages';

@Injectable()
export class adminChecker implements NestMiddleware {
    constructor(private jwtService: JwtService) { }
    use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) return res.send("you must be logged in")

            let token = req.headers.authorization?.split(' ')[1] 

            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })
            req.body.decoded = decoded
            res.locals.decoded = decoded
            if (decoded.roleId === 1) next()
            else res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
            
        } catch (error) {
            console.log(error)
            if (error.message === "jwt expired") res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.LOGIN_AGAIN)
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }


        // next();
    }
}