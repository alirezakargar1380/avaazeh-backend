import { Body, Param, Controller, Get, Post, Put, Delete, Res, HttpStatus, Req } from "@nestjs/common";
import { Project } from "src/project/entitys/project.entity";
import { ProjectService } from "src/project/project.service";
import { ReportService } from "src/report/report.service";
import { Response } from 'express';
import errorMessages from "src/shared/constants/errorMessages";
import { ReportStatusService } from "./report_status.service";
import { Report } from "src/report/entitys/report.entity";
import succssMessages from "src/shared/constants/succssMessages";
import { ReportsAccService } from "src/reports-acc/reports-acc.service";
import { ReportsAcc } from "src/reports-acc/entitys/reports.acc.entity";
import { LogsService } from "src/logs/logs.service";
import logsActions from "src/shared/constants/logsActions";

@Controller('report-status')
export class ReportStatusController {
    constructor(
        private readonly reportService: ReportService,
        private readonly reportStatusService: ReportStatusService,
        private readonly projectService: ProjectService,
        private readonly reportsAccService: ReportsAccService,
        private readonly logsService: LogsService
    ) { }

    @Put('/:reportId')
    async refuse_the_report(@Req() req: any, @Body() body: any, @Param() param: any, @Res() res: Response) {
        try {
            const reportAcc: ReportsAcc = await this.reportsAccService.get(res.locals.decoded.roleId)
            if (!reportAcc.set_status)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            const report: any = await this.reportService.findOne(Number(param.reportId))
            if (!report) return res.status(HttpStatus.FOUND).send(errorMessages.CANT_FIND_REPORT)
            // if (report.creator?.id === res.locals?.decoded?.id) return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_UPDATE_YOUR_DATA)
            if (report.status) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CANT_UPDATE_ACCEPTED_REPORT)

            const project: Project = await this.projectService.findOne(report.project.id, { executiveOrganization: true })
            if (!project || !project.executiveOrganization) return res.status(HttpStatus.FOUND).send(errorMessages.CANT_FIND_PROJECT)
            // if (project.executiveOrganization.id !== res.locals.decoded.organization && !res.locals.accessibility.all_organ_access) return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.ADMIN_PERMISSION)
            // if (project.executiveOrganization.id !== res.locals.decoded.organization) return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.ADMIN_PERMISSION)

            await this.reportService.update(Number(report.id), {
                status: body.status
            })

            if (body.subject) {
                await this.reportStatusService.create({
                    report: report.id,
                    reporter: res.locals.decoded.id,
                    ...body
                })

                const userInfo = res.locals.decoded
                this.logsService.addLog({
                    action: logsActions.ADD_COMMENT_TO_REPORT,
                    title: body.subject,
                    organization: userInfo.organization,
                    role: userInfo.roleId,
                    user: userInfo.id,
                    ip: req.connection.remoteAddress
                })
            }


            res.status(HttpStatus.ACCEPTED).send(succssMessages.UPDATE_AN_RECORD)
        } catch (e) {
            console.log(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }

    }

    @Get('/:reportId')
    async report_comments(@Body() body: any, @Param() param: any, @Res() res: Response) {
        try {
            const reportAcc: ReportsAcc = await this.reportsAccService.get(res.locals.decoded.roleId)
            if (!reportAcc.set_status)
                return res.status(HttpStatus.EXPECTATION_FAILED).send('سطح دسترسی پیدا نشد')

            // if (!reportAcc.add)
            //     return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            const report: any = await this.reportService.findOne(Number(param.reportId))
            if (!report) return res.status(HttpStatus.FOUND).send(errorMessages.CANT_FIND_REPORT)

            const project: Project = await this.projectService.findOne(report.project.id, { executiveOrganization: true })
            if (!project || !project.executiveOrganization) return res.status(HttpStatus.FOUND).send(errorMessages.CANT_FIND_PROJECT)

            if (project.executiveOrganization.id !== res.locals.decoded.organization && !res.locals.accessibility.all_organ_access)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.ADMIN_PERMISSION)

            res
                .status(HttpStatus.ACCEPTED)
                .send(await this.reportStatusService.findByReportId(param.reportId))

        } catch (e) {
            console.log(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }

    }

}
