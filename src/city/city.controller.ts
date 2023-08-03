import { Controller, Post, Body, Res, HttpStatus, Req, Get, Delete, Param } from '@nestjs/common';
import { CityService } from './city.service';
import { Response, Request } from 'express';
import { CreateCity } from './dto/city.dto';
import { loginMessages } from 'src/authentication/constants';
import errorMessages from 'src/shared/constants/errorMessages';
import { VariableSettingsAccService } from 'src/variable_settings-acc/variable_settings-acc.service';
import { LogsService } from 'src/logs/logs.service';
import { VariableSettingsAcc } from 'src/variable_settings-acc/entitys/variable_settings.acc.entity';
import logsActions from 'src/shared/constants/logsActions';

@Controller('city')
export class CityController {
    constructor(
        private readonly cityService: CityService,
        private readonly variableSettingsService: VariableSettingsAccService,
        private readonly logsService: LogsService
    ) { }

    @Get()
    async getCitys(@Body() body: CreateCity, @Res() res: Response) {
        try {
            res
                .status(HttpStatus.ACCEPTED)
                .send(await this.cityService.findAll())
        } catch (e) {
            console.log(e)
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Delete('/:id')
    async deleteCity(@Param() params, @Res() res: Response) {
        try {
            res
                .status(HttpStatus.ACCEPTED)
                .send(await this.cityService.delete(Number(params.id)));
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Post()
    async addCitys(@Req() req: any, @Body() body: CreateCity, @Res() res: Response) {
        try {
            const variableSettingsAcc: VariableSettingsAcc = await this.variableSettingsService.get(res.locals.decoded.roleId)
            if (!variableSettingsAcc.add)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            // VALIDATION    

            res
                .status(HttpStatus.ACCEPTED)
                .send(await this.cityService.save(body))

            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.ADD_CITY,
                title: body.name,
                organization: userInfo.organization,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: ""
            })
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.DUBLICATE_DATA);
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }
}
