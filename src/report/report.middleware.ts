import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import errorMessages from 'src/shared/constants/errorMessages';
import { AccessibilityService } from 'src/accessibility/accessibility.service';

@Injectable()
export class reportSectionAccessibilityMiddleware implements NestMiddleware {
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

            req.body.decoded = decoded
            req.body.accessibility = accessibility
            console.log(decoded);
            console.log(accessibility);

            // if (req.method === "GET") {
            //     (accessibility.report_section) ? next() : res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)
            // } else if (req.method === "POST") {
            //     (accessibility.report_section) ? next() : res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)
            // } else if (req.method === "PUT") {
            //     (accessibility.report_section) ? next() : res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)
            // } else if (req.method === "DELETE") {
            //     (accessibility.report_section) ? next() : res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)
            // }

        } catch (error) {
            console.log(error)
            if (error.message === "jwt expired") res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.LOGIN_AGAIN)
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }


        // next();
    }
}