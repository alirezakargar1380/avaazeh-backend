import { Injectable, NestMiddleware, HttpStatus, RequestMethod } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import errorMessages from 'src/shared/constants/errorMessages';
import { AccessibilityService } from 'src/accessibility/accessibility.service';

@Injectable()
export class projectSectionAccessibilityMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private accessiblityService: AccessibilityService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization) return res.send("you must be logged in")
            let token = req.headers.authorization?.split(' ')[1]

            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })
            const accessibility = await this.accessiblityService.getAccessibilityByRoleId(decoded.roleId)

            res.locals.decoded = decoded
            res.locals.accessibility = accessibility
            console.log(decoded)
            console.log(accessibility)

            next()

        } catch (error) {
            console.log(error)
            if (error.message === "jwt expired") res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.LOGIN_AGAIN)
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }


        // next();
    }
}