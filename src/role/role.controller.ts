import { Body, Controller, Get, Post, Res, HttpStatus, Put, Param, Req } from "@nestjs/common";
import { Response } from 'express';
import { AccessibilityService } from "src/accessibility/accessibility.service";
import errorMessages from "src/shared/constants/errorMessages";
import { CreateRoleDto } from "./dto/role.dto";
import { Role } from "./entitys/role.entity";
import { RoleService } from './role.service';
import { LogsService } from "src/logs/logs.service";
import logsActions from "src/shared/constants/logsActions";
import { ProjectsAccService } from "src/projects-acc/projects-acc.service";
import { ReportsAccService } from "src/reports-acc/reports-acc.service";
import { RoleAccService } from "src/role-acc/role-acc.service";
import { SettingsAccService } from "src/settings-acc/settings-acc.service";
import { VariableSettingsAccService } from "src/variable_settings-acc/variable_settings-acc.service";
import { UsersAccService } from "src/users-acc/users-acc.service";
import { LogsAccService } from "src/logs-acc/logs-acc.service";
import succssMessages from "src/shared/constants/succssMessages";
import { RolesAcc } from "src/role-acc/entitys/roles.acc.entity";
import paginationHelper from "pagination-helper";

@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
        private readonly accessibiltyService: AccessibilityService,
        private readonly logsService: LogsService,
        private readonly projectsAccService: ProjectsAccService,
        private readonly reportsAccService: ReportsAccService,
        private readonly rolesAccService: RoleAccService,
        private readonly settingsAccService: SettingsAccService,
        private readonly variableSettingsAccService: VariableSettingsAccService,
        private readonly usersAccServiceService: UsersAccService,
        private readonly logsAccServiceService: LogsAccService
    ) { }

    @Post()
    async addRole(@Req() req: any, @Body() body: CreateRoleDto, @Res() res: Response) {
        try {
            const roleAcc: RolesAcc = await this.rolesAccService.get(res.locals.decoded.roleId)
            if (!roleAcc.add)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            const createdRole: Role | any = await this.roleService.save({
                title: body.title
            })

            if (!res.locals.accessibility.all_organ_access) {
                if (body.accessibility.all_organ_access)
                    return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CANT_ACCESS_HERE)
            }

            // acc 
            await this.accessibiltyService.save({
                role: createdRole.id,
                ...body.accessibility
            })

            // acc-section
            await this.projectsAccService.save({ ...body.projectAcc, role: createdRole.id })
            await this.reportsAccService.save({ ...body.reportAcc, role: createdRole.id })
            await this.rolesAccService.save({ ...body.rolesAcc, role: createdRole.id })
            await this.settingsAccService.save({ ...body.settingsAcc, role: createdRole.id })
            await this.variableSettingsAccService.save({ ...body.variableSettingsAcc, role: createdRole.id })
            await this.usersAccServiceService.save({ ...body.usersAcc, role: createdRole.id })
            await this.logsAccServiceService.save({ ...body.logsAcc, role: createdRole.id })

            delete createdRole.decoded
            res.status(HttpStatus.CREATED).send(createdRole);

            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.ADD_ROLE,
                title: body.title,
                organization: userInfo.organization,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: ""
            })

        } catch (e) {
            console.log(e)
            if (e.code === 'ER_DUP_ENTRY') res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.DUBLICATE_DATA);
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Put('/:id')
    async updateRole(@Body() body: CreateRoleDto, @Param() param: any, @Res() res: Response) {
        try {
            const roleAcc: RolesAcc = await this.rolesAccService.get(res.locals.decoded.roleId)
            if (!roleAcc.add)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            if (!res.locals.accessibility.all_organ_access) {
                if (body.accessibility.all_organ_access)
                    return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CANT_ACCESS_HERE)
            }

            const role: Role = await this.roleService.findOneById(Number(param.id))

            await this.roleService.update(role.id, { title: body.title })
            await this.accessibiltyService.updateAccessiblity(role.id, body.accessibility)
            await this.projectsAccService.update(body.projectAcc, role.id)
            await this.reportsAccService.update(body.reportAcc, role.id)
            await this.rolesAccService.update(body.rolesAcc, role.id)
            await this.settingsAccService.update(body.settingsAcc, role.id)
            await this.variableSettingsAccService.update(body.variableSettingsAcc, role.id)
            await this.usersAccServiceService.update(body.usersAcc, role.id)
            await this.logsAccServiceService.update(body.logsAcc, role.id)

            res.status(HttpStatus.CREATED).send(succssMessages.UPDATE_AN_RECORD);
        } catch (e) {
            console.log(e)
            if (e.code === 'ER_DUP_ENTRY') res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.DUBLICATE_DATA);
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get('/accessibility/:id')
    async getOneRole(@Res() res: Response, @Param() param: any) {
        try {
            const roleId: number = Number(param.id)
            const roleAcc: RolesAcc = await this.rolesAccService.get(res.locals.decoded.roleId)
            if (!roleAcc.get) {
                // if (roleId !== res.locals.decoded.roleId && !res.locals.accessibility.all_organ_access)
                return res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)
            }

            res
                .status(HttpStatus.ACCEPTED)
                .send({
                    "role": await this.roleService.findOneById(roleId),
                    "projectAcc": await this.projectsAccService.get(roleId),
                    "reportAcc": await this.reportsAccService.get(roleId),
                    "rolesAcc": await this.rolesAccService.get(roleId),
                    "settingsAcc": await this.settingsAccService.get(roleId),
                    "variableSettingsAcc": await this.variableSettingsAccService.get(roleId),
                    "usersAcc": await this.usersAccServiceService.get(roleId),
                    "logsAcc": await this.logsAccServiceService.get(roleId),
                    "organ": await this.accessibiltyService.findOneAccessiblityByRoleId(roleId)
                })
        } catch (e) {
            console.log(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get('/accessibility')
    async getOneRkole(@Res() res: Response) {
        try {
            const roleId: number = Number(res.locals.decoded.roleId)

            res.status(HttpStatus.ACCEPTED)
                .send({
                    "role": await this.roleService.findOneById(roleId),
                    "projectAcc": await this.projectsAccService.get(roleId),
                    "reportAcc": await this.reportsAccService.get(roleId),
                    "rolesAcc": await this.rolesAccService.get(roleId),
                    "settingsAcc": await this.settingsAccService.get(roleId),
                    "variableSettingsAcc": await this.variableSettingsAccService.get(roleId),
                    "usersAcc": await this.usersAccServiceService.get(roleId),
                    "logsAcc": await this.logsAccServiceService.get(roleId),
                    "organ": await this.accessibiltyService.findOneAccessiblityByRoleId(roleId)
                })
        } catch (e) {
            console.log(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
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
        // const roleAcc: RolesAcc = await this.rolesAccService.get(res.locals.decoded.roleId)
        // if (!roleAcc.get) {
        //     return res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)
        // }

        const roles: Role[] = await this.roleService.find()
        res.status(HttpStatus.ACCEPTED).send({
            data: roles
        })
    }
}
