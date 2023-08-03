import { Controller, Post, Get, Body, Res, HttpStatus, Req, Put, Param } from '@nestjs/common';
import { AccessibilityService } from './accessibility.service';
import { Response, Request } from 'express';
import { RoleService } from 'src/role/role.service';
import succssMessages from 'src/shared/constants/succssMessages';
import { ReportsAcc } from 'src/reports-acc/entitys/reports.acc.entity';
import errorMessages from 'src/shared/constants/errorMessages';
import { RoleAccService } from 'src/role-acc/role-acc.service';
import { RolesAcc } from 'src/role-acc/entitys/roles.acc.entity';

@Controller('accessibility')
export class AccessibilityController {
    constructor(
        private readonly accessibilityService: AccessibilityService,
        private readonly roleService: RoleService,
        private readonly rolesAccService: RoleAccService
    ) { }

    @Get('/')
    async get(@Req() req: Request, @Body() body: any, @Res() res: Response) {
        try {
            console.log(res.locals.decoded.id)
            res.status(HttpStatus.ACCEPTED).send(await this.accessibilityService.findOneAccessiblityByRoleId(res.locals.decoded.roleId))
        } catch (error) {

        }
    }

    @Get('/:per_page_data/:page')
    async getAccessibility(@Req() req: Request, @Body() body: any, @Res() res: Response) {
        try {
            const rolesAcc: RolesAcc = await this.rolesAccService.get(res.locals.decoded.roleId)
            if (!rolesAcc.get)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            res.status(HttpStatus.ACCEPTED).send(await this.accessibilityService.findAll())
        } catch (error) {

        }
    }

    @Get('/:id')
    async get_one_by_id(@Body() body: any, @Param() param: any, @Res() res: Response) {
        try {
            const rolesAcc: RolesAcc = await this.rolesAccService.get(res.locals.decoded.roleId)
            if (!rolesAcc.get)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
                
            console.log('--->')
            res.status(HttpStatus.ACCEPTED)
                .send(await this.accessibilityService.findOneAccessiblityByRoleId(Number(param.id)))
        } catch (error) {

        }
    }

    @Put('/:accessiblity_id')
    async updateAccessiblity(@Req() req: Request, @Param() param: any, @Body() body: any, @Res() res: Response) {
        try {
            const accessiblity: any = await this.accessibilityService.findOneAccessiblity(Number(param.accessiblity_id))
            await this.roleService.update(accessiblity.role.id, { title: body.title })
            delete body.title
            // console.log(body.accessibility)
            // return
            await this.accessibilityService.updateAccessiblity(Number(param.accessiblity_id), body.accessibility)

            res.status(HttpStatus.ACCEPTED)
                .send(succssMessages.UPDATE_AN_RECORD)
        } catch (error) {
            console.log(error)
            console.log(error.code === "ER_DUP_ENTRY")
        }
    }
}
