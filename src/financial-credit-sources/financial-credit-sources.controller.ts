import { Controller, Get, Post, Res, HttpStatus, Body, Req } from '@nestjs/common';
import { FinancialCreditSourcesService } from './financial-credit-sources.service';
import { Response } from 'express';
import errorMessages from 'src/shared/constants/errorMessages';
import { LogsService } from 'src/logs/logs.service';
import logsActions from 'src/shared/constants/logsActions';
import financialCreditSources from 'src/financial-credit-sources/validation/financial-credit-sources.validation';

@Controller('financial-credit-sources')
export class FinancialCreditSourcesController {
    constructor(
        private readonly financialCreditSourceService: FinancialCreditSourcesService,
        private readonly logsService: LogsService,
    ) { }

    @Post()
    async createFc(@Req() req: any, @Res() res: Response, @Body() body: any) {
        try {
            financialCreditSources.add_data(body)
            res.status(HttpStatus.ACCEPTED).send(await this.financialCreditSourceService.save(body))

            // LOG
            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.ADD_FinancialCreditSources,
                title: body.title,
                organization: userInfo.organization,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: ""
            })
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get()
    async get_fc(@Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.financialCreditSourceService.find())
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }
}
