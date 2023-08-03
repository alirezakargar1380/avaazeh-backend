import { Body, Param, Controller, Get, Post, Put, Query, Delete, Res, HttpStatus } from "@nestjs/common";
import { LogsService } from './logs.service';
import { Response } from 'express';
import { LogsAccService } from "src/logs-acc/logs-acc.service";
import { LogsAcc } from "src/logs-acc/entitys/logs.acc.entity";
import paginationHelper, { IPaginationHelper } from "pagination-helper";

@Controller('logs')
export class LogsController {
    constructor(
        private readonly logsService: LogsService,
        private readonly logsAccService: LogsAccService
    ) { }

    @Get("/:perPage/:page")
    async getData(@Param() param: any, @Res() res: Response) {
        try {
            const logsAcc: LogsAcc = await this.logsAccService.get(res.locals.decoded.roleId)
            const count: number = await this.logsService.count({
                all_organ_access: res.locals.accessibility.all_organ_access,
                organization: res.locals.decoded.organization,
                user_id: res.locals.decoded.id,
                logsAcc: logsAcc
            })

            let pagination: IPaginationHelper = new paginationHelper({
                numberOfDataPerPage: Number(param.perPage),
                current_page_number: Number(param.page),
                short: true
            })

            res.status(HttpStatus.ACCEPTED).send({
                "pages": pagination.getDetailsOfTheNumberOfPages(count),
                "current_page": Number(param.page),
                "count": await this.logsService.count({
                    all_organ_access: res.locals.accessibility.all_organ_access,
                    organization: res.locals.decoded.organization,
                    user_id: res.locals.decoded.id,
                    logsAcc: logsAcc
                }),
                "data": await this.logsService.find(Number(param.perPage), Number(param.page), {
                    all_organ_access: res.locals.accessibility.all_organ_access,
                    organization: res.locals.decoded.organization,
                    user_id: res.locals.decoded.id,
                    logsAcc: logsAcc
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    @Get("/:user_id")
    async getUserLogs(@Param() param: any, @Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(
                await this.logsService.findOne(Number(param.user_id))
            )
        } catch (error) {
            console.log(error)
        }
    }
}
