import { Body, Param, Controller, Get, Post, Put, Patch, Delete, Res, HttpStatus, Query } from "@nestjs/common";
import { ReportService } from './report.service';
import { Response } from 'express';
import { ReportStatusService } from "src/report_status/report_status.service";
import { CreateReportDto, GetReportDto, ReportChart, ReportParamsDto, ReportQueryDto, UpdateReportDto } from "./dto/report.dto";
import { Report } from "./entitys/report.entity";
import { ReportStatus } from "src/report_status/entitys/reportStatus.entity";
import { ReportImageService } from "./report_image.service";
import errorMessages from "src/shared/constants/errorMessages";
import { ProjectService } from "src/project/project.service";
import Validateeee from 'src/report/validation/report.validation';
import { LogsService } from "src/logs/logs.service";
import logsActions from "src/shared/constants/logsActions";
import { ReportsAcc } from "src/reports-acc/entitys/reports.acc.entity";
import { ReportsAccService } from "src/reports-acc/reports-acc.service";
import paginationHelper from "pagination-helper";
import succssMessages from "src/shared/constants/succssMessages";
import { Ip, Req } from "@nestjs/common/decorators/http/route-params.decorator";
import { PMonth } from "src/shared/utils/persionDate.utility";

@Controller('report')
export class ReportController {
    constructor(
        private readonly reportService: ReportService,
        private readonly reportStatusService: ReportStatusService,
        private readonly reportImageService: ReportImageService,
        private readonly projectService: ProjectService,
        private readonly logsService: LogsService,
        private readonly reportsAccService: ReportsAccService
    ) { }

    @Get('/chart')
    async aaa(@Param() param: any, @Body() body: any, @Res() res: Response) {
        try {
            let lables: string[] = []
            let dataset: number[] = []
            const data: ReportChart[] = await this.reportService.get_sum()

            data.map((item: ReportChart) => {
                lables.push(PMonth[item.report_month])
                dataset.push(Number(item.numberOfReports))
            })

            res.send({
                lables: lables,
                dataset: dataset,
                data: data
            })
        } catch (error) {
            console.log(error)
        }
    }

    @Get('/:reportId')
    async getOneReportOfProject(@Req() req: any, @Param() param: any, @Body() body: any, @Res() res: Response) {
        try {
            const report: any = await this.reportService.get_one_reports(res.locals.decoded.organization, Number(param.reportId), res.locals.accessibility.all_organ_access)
            if (!report) return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_FIND_REPORT)

            res.send({
                "can_edit": (report.creator?.id === res.locals?.decoded?.id),
                "report": report,
                "images": await this.reportImageService.find(report.id)
            })

            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.SEE_REPORT,
                title: `${report.id}`,
                organization: userInfo.organization,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: ""
            })
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get()
    async get_user_createdReports(@Body() body: any, @Query() query: ReportQueryDto, @Param() param: ReportParamsDto, @Res() res: Response) {
        try {
            Validateeee.params(query)

            let count: number = 0
            let data: any = []
            let status: null | boolean
            if (query.status === "0")
                status = null
            else if (query.status === "1")
                status = false
            else if (query.status === "2")
                status = true

            const reportAcc: ReportsAcc = await this.reportsAccService.get(res.locals.decoded.roleId)

            let getReportsParams: GetReportDto = {
                accessiblity: res.locals.accessibility,
                organ_id: res.locals.decoded.organization,
                user_data: res.locals.decoded,
                without_set_status: false,
                // my_reports: true,
                perPage: param.perPage,
                page: param.page,
                reportAcc: reportAcc,
                query: query
            }
            if (query.status) getReportsParams.status = status

            res.send("nothing...")
        } catch (error) {
            console.log(error)
        }
    }


    @Get('/unchecked/:perPage/:page')
    async get_all_accepted_reports(@Body() body: any, @Query() query: ReportQueryDto, @Param() param: any, @Res() res: Response) {
        try {
            Validateeee.params(query)

            let count: number = 0
            let data: any = []
            let status: null | boolean
            if (query.status === "0")
                status = null
            else if (query.status === "1")
                status = false
            else if (query.status === "2")
                status = true

            const reportAcc: ReportsAcc = await this.reportsAccService.get(res.locals.decoded.roleId)

            let getReportsParams: GetReportDto = {
                accessiblity: res.locals.accessibility,
                organ_id: res.locals.decoded.organization,
                user_data: res.locals.decoded,
                without_set_status: true,
                // my_reports: true,
                perPage: param.perPage,
                page: param.page,
                reportAcc: reportAcc,
                query: query
            }
            if (query.status) getReportsParams.status = status

            count = await this.reportService.count_reports(getReportsParams)
            data = await this.reportService.get_reports(getReportsParams)
            data.sort((a: any, b: any) => a.id - b.id)

            let pagination = new paginationHelper({
                numberOfDataPerPage: Number(param.perPage),
                current_page_number: Number(param.page),
                short: true
            })

            res.send({
                "count": count,
                "pages": pagination.getDetailsOfTheNumberOfPages(count),
                "current_page": Number(param.page),
                "data": data
            })
        } catch (error) {
            console.log(error)
        }
    }

    @Get('/user/:perPage/:page')
    async get_user_reports(@Body() body: any, @Query() query: ReportQueryDto, @Param() param: any, @Res() res: Response) {
        try {
            Validateeee.params(query)

            let count: number = 0
            let data: any = []
            let status: null | boolean
            if (query.status === "0")
                status = null
            else if (query.status === "1")
                status = false
            else if (query.status === "2")
                status = true

            const reportAcc: ReportsAcc = await this.reportsAccService.get(res.locals.decoded.roleId)

            let getReportsParams: GetReportDto = {
                accessiblity: res.locals.accessibility,
                organ_id: res.locals.decoded.organization,
                user_data: res.locals.decoded,
                // without_set_status: true,
                my_reports: true,
                perPage: param.perPage,
                page: param.page,
                reportAcc: reportAcc,
                query: query
            }
            if (query.status) getReportsParams.status = status

            count = await this.reportService.count_reports(getReportsParams)
            data = await this.reportService.get_reports(getReportsParams)
            data.sort((a: any, b: any) => a.id - b.id)

            let pagination = new paginationHelper({
                numberOfDataPerPage: Number(param.perPage),
                current_page_number: Number(param.page),
                short: true
            })

            res.send({
                "count": count,
                "pages": pagination.getDetailsOfTheNumberOfPages(count),
                "current_page": Number(param.page),
                "data": data
            })
        } catch (error) {
            console.error(error)
        }
    }

    @Get('/:perPage/:page')
    async getAllReports(@Req() req: any, @Body() body: any, @Query() query: ReportQueryDto, @Param() param: ReportParamsDto, @Res() res: Response) {
        try {
            Validateeee.params(query)

            let count: number = 0
            let data: any = []
            let status: null | boolean
            if (query.status === "0")
                status = null
            else if (query.status === "1")
                status = false
            else if (query.status === "2")
                status = true

            const reportAcc: ReportsAcc = await this.reportsAccService.get(res.locals.decoded.roleId)

            let getReportsParams: GetReportDto = {
                accessiblity: res.locals.accessibility,
                organ_id: res.locals.decoded.organization,
                user_data: res.locals.decoded,
                without_set_status: false,
                // my_reports: true,
                perPage: param.perPage,
                page: param.page,
                reportAcc: reportAcc,
                query: query
            }
            if (query.status) getReportsParams.status = status

            count = await this.reportService.count_reports(getReportsParams)
            data = await this.reportService.get_reports(getReportsParams)
            data.sort((a: any, b: any) => a.id - b.id)

            let pagination = new paginationHelper({
                numberOfDataPerPage: Number(param.perPage),
                current_page_number: Number(param.page),
                short: true
            })

            res.send({
                "count": count,
                "pages": pagination.getDetailsOfTheNumberOfPages(count),
                "current_page": Number(param.page),
                "data": data
            })
        } catch (e) {
            console.error(e)
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get('/count/uncheck/numberOfReports')
    async getReportOfProject(@Body() body: any, @Param() param: any, @Res() res: Response) {
        try {
            const reportAcc: ReportsAcc = await this.reportsAccService.get(res.locals.decoded.roleId)
            let getReportsParams: GetReportDto = {
                accessiblity: res.locals.accessibility,
                organ_id: res.locals.decoded.organization,
                user_data: res.locals.decoded,
                reportAcc: reportAcc,
                without_set_status: true,
                query: {
                    status: null
                }
            }
            res.status(HttpStatus.ACCEPTED).send({ count_unchecked: await this.reportService.count_reports(getReportsParams) })
        } catch (e) {
            console.error(e)
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    // @Get('/accepted/:perPage/:page/:projectId')
    // async get_all_accepted_reportsOfProject(@Body() body: any, @Param() param: any, @Res() res: Response) {
    //     try {
    //         res.send({
    //             reports: await this.reportService.get_reports({
    //                 accessiblity: res.locals.accessibility,
    //                 organ_id: res.locals.decoded.organization,
    //                 status: true,
    //                 user_data: res.locals.decoded,
    //                 projectId: param.projectId,
    //                 perPage: param.perPage,
    //                 page: param.page
    //             }),
    //             count: await this.reportService.count_reports({
    //                 accessiblity: res.locals.accessibility,
    //                 organ_id: res.locals.decoded.organization,
    //                 status: true,
    //                 user_data: res.locals.decoded,
    //                 projectId: param.projectId,
    //                 perPage: param.perPage,
    //                 page: param.page
    //             })
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // @Get('/unaccepted/:perPage/:page')
    // async get_unaccepted_ReportOfProject(@Body() body: any, @Param() param: any, @Res() res: Response) {
    //     try {
    //         res.send(await this.reportService.get_reports({
    //             accessiblity: res.locals.accessibility,
    //             organ_id: res.locals.decoded.organization,
    //             status: false,
    //             user_data: res.locals.decoded,
    //             projectId: param.projectId,
    //             perPage: param.perPage,
    //             page: param.page
    //         }))
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    @Post('/:projectId')
    async addReportToProject(@Req() req: any, @Body() body: any, @Param() param: any, @Res() res: Response) {
        try {
            const reportAcc: ReportsAcc = await this.reportsAccService.get(res.locals.decoded.roleId)
            if (!reportAcc.add)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
            else {
                const project: any = await this.projectService.findOne(Number(param.projectId), {
                    executiveOrganization: true,
                })
                if (project.executiveOrganization.id !== res.locals.decoded.organization && !res.locals.accessibility.all_organ_access)
                    return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.NOT_FOR_YOUR_ORGAN)
            }


            body.creator = res.locals.decoded.id

            // validate data
            Validateeee.reportToProject(body)
            const report: any = await this.reportService.create(body, Number(param.projectId))

            if (body.images.length)
                await this.reportImageService.addImages(body.images, report.id)

            delete report.decoded
            res.send(report)

            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.ADD_REPORT,
                title: param.projectId,
                organization: userInfo.organization,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: ""
            })

        } catch (e) {
            console.error(e)
            if (e.code === 'ER_DUP_ENTRY') return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.DUBLICATE_DATA);
            else if (e.errno === 1452) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CANT_FIND_REF);
            else if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            else return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Put('/:reportId')
    async update_report(@Body() body: UpdateReportDto | any, @Param() param: any, @Res() res: Response) {
        try {
            if (res.locals.accessibility.admin_organ) {
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
            }

            await this.reportService.update(Number(param.reportId), body)

            res.status(HttpStatus.ACCEPTED).send(succssMessages.UPDATE_AN_RECORD)
        } catch (e) {
            console.error(e)
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Patch('/:reportId')
    async update_image_report(@Body() body: UpdateReportDto | any, @Param() param: any, @Res() res: Response) {
        try {
            if (res.locals.accessibility.admin_organ) {
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
            }

            if (body?.images.length)
                await this.reportImageService.addImages(body.images, Number(param.reportId))

            res.status(HttpStatus.ACCEPTED).send(succssMessages.UPDATE_AN_RECORD)
        } catch (e) {
            console.error(e)
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Delete('/:reportId')
    async deleteReport(@Body() body: CreateReportDto, @Param() param: any, @Res() res: Response) {
        try {
            await this.reportService.deleteByReportId(Number(param.reportId))
        } catch (error) {
            console.error(error)
        }
    }
}
