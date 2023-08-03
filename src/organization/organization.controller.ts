import { Body, Param, Controller, Get, Post, Delete, Res, HttpStatus, Req } from "@nestjs/common";
import { Response } from "express";
import { LogsService } from "src/logs/logs.service";
import errorMessages from "src/shared/constants/errorMessages";
import logsActions from "src/shared/constants/logsActions";
import { VariableSettingsAcc } from "src/variable_settings-acc/entitys/variable_settings.acc.entity";
import { VariableSettingsAccService } from "src/variable_settings-acc/variable_settings-acc.service";
import { CreateOrganizationDto, DeleteOrganizationDto, GetOrganizationDto } from "./dto/organization.dto";
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
    constructor(
        private readonly organizationService: OrganizationService,
        private readonly variableSettingsService: VariableSettingsAccService,
        private readonly logsService: LogsService
    ) { }

    @Post()
    async addOrganization(@Req() req: any, @Body() body: CreateOrganizationDto, @Res() res: Response) {
        try {
            const variableSettingsAcc: VariableSettingsAcc = await this.variableSettingsService.get(res.locals.decoded.roleId)
            if (!variableSettingsAcc.add)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            res.status(HttpStatus.CREATED).send(await this.organizationService.save(body))

            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.ADD_ORGANIZATION,
                title: body.organization_name,
                organization: userInfo.organization,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: ""
            })
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') res.status(HttpStatus.METHOD_NOT_ALLOWED).send('this organization is already exist');
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('')
        }
    }

    @Get('/:perPage/:page')
    async getOrganization(@Param() param: GetOrganizationDto, @Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.organizationService.find(param.perPage, param.page))
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Delete('/:id')
    async deleteOrganization(@Param() param: DeleteOrganizationDto, @Res() res: Response) {
        try {
            const variableSettingsAcc: VariableSettingsAcc = await this.variableSettingsService.get(res.locals.decoded.roleId)
            if (!variableSettingsAcc.delete)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            res.status(HttpStatus.ACCEPTED).send(await this.organizationService.delete(param.id as number))
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }
}
