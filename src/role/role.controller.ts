import { Body, Controller, Get, Post, Res, HttpStatus, Put, Param, Req } from "@nestjs/common";
import { Response } from 'express';
import { AccessibilityService } from "src/accessibility/accessibility.service";
import errorMessages from "src/shared/constants/errorMessages";
import { CreateRoleDto } from "./dto/role.dto";
import { Role } from "./entitys/role.entity";
import { RoleService } from './role.service';
import logsActions from "src/shared/constants/logsActions";
import { SettingsAccService } from "src/settings-acc/settings-acc.service";
import succssMessages from "src/shared/constants/succssMessages";
import paginationHelper from "pagination-helper";
import { LogsService } from "src/logs/logs.service";
import { error_response } from "src/shared/response/response";

@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
        private readonly accessibiltyService: AccessibilityService,
        private readonly settingsAccService: SettingsAccService,
        private readonly logsService: LogsService,
    ) { }

    @Post()
    async addRole(@Req() req: any, @Body() body: CreateRoleDto, @Res() res: Response) {
        try {
            const createdRole: Role | any = await this.roleService.save({
                title: body.title,
                isAdmin: body.isAdmin
            })
            res.status(HttpStatus.CREATED).send(createdRole);

            // const userInfo = res.locals.decoded
            // this.logsService.addLog({
            //     action: logsActions.ADD_ROLE,
            //     title: body.title,
            //     role: userInfo.roleId,
            //     user: userInfo.id,
            //     ip: ""
            // })

        } catch (e) {
            error_response(e, res)
        }
    }

    @Put('/:id')
    async updateRole(@Body() body: CreateRoleDto, @Param() param: any, @Res() res: Response) {
        try {
            const role: Role = await this.roleService.findOneById(Number(param.id))

            await this.roleService.update(role.id, {
                title: body.title,
                isAdmin: body.isAdmin
            })

            res.status(HttpStatus.CREATED).send(succssMessages.UPDATE_AN_RECORD);
        } catch (e) {
            console.log(e)
            if (e.code === 'ER_DUP_ENTRY') res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.DUBLICATE_DATA);
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get('/:perPage/:page')
    async getRolesPagination(@Res() res: Response, @Param() param: any) {
        // const roleAcc: RolesAcc = await this.rolesAccService.get(res.locals.decoded.roleId)
        // if (!roleAcc.get) {
        //     return res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)
        // }

        const pagesNum: number = await this.roleService.count()
        let pagination = new paginationHelper({
            numberOfDataPerPage: Number(param.perPage),
            current_page_number: Number(param.page),
            short: true
        })

        const roles: Role[] = await this.roleService.findAll(param)
        res.status(HttpStatus.ACCEPTED).send({
            count: pagesNum,
            pages: pagination.getNumberOfPages(pagesNum),
            pageNumbers_details: pagination.getDetailsOfTheNumberOfPages(pagesNum),
            current_page: Number(param.page),
            data: roles
        })
    }

    @Get()
    async getRoles(@Res() res: Response) {
        const roles: Role[] = await this.roleService.find()
        res.status(HttpStatus.ACCEPTED).send({
            data: roles
        })
    }
}
