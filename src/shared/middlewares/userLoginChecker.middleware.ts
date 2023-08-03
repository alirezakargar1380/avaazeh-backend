import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../authentication/constants';
import errorMessages from '../constants/errorMessages';
import { AccessibilityService } from 'src/accessibility/accessibility.service';

@Injectable()
export class userLoginChecker implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private accessiblityService: AccessibilityService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) return res.status(HttpStatus.BAD_REQUEST).send("you must be logged inn")

            let token = req.headers.authorization?.split(' ')[1]

            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })
            const accessibility = await this.accessiblityService.getAccessibilityByRoleId(decoded.roleId)

            // req.body.decoded = decoded // this sould delete
            res.locals.decoded = decoded
            res.locals.accessibility = accessibility

            next()
        } catch (error) {
            console.log(error)
            if (error.message === "jwt expired") res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.LOGIN_AGAIN)
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }
}