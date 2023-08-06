import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { error_response } from '../response/response';

@Injectable()
export class userLoginChecker implements NestMiddleware {
    constructor(
        private jwtService: JwtService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) return res.status(HttpStatus.BAD_REQUEST).send("you must be logged in")

            let token = req.headers.authorization?.split(' ')[1]

            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })
            res.locals.user = decoded

            next()
        } catch (error) {
            error_response(error, res)
        }
    }
}