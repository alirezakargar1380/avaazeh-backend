import { Body, Param, Controller, Get, Post, Put, Query, Delete, Res, HttpStatus, Req } from "@nestjs/common";
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';
import { Response } from 'express';
import validation from './validation/project.validation';
import { date_validation } from "src/shared/validation/validation";
import errorMessages from "src/shared/constants/errorMessages";
import { LogsService } from 'src/logs/logs.service';
import logsActions from "src/shared/constants/logsActions";
import { ProjectsAccService } from "src/projects-acc/projects-acc.service";
import { ProjectsAcc } from "src/projects-acc/entitys/projects.acc.entity";
import succssMessages from "src/shared/constants/succssMessages";
import paginationHelper, { IPaginationHelper } from "pagination-helper";

@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly logsService: LogsService,
        private readonly projectAccService: ProjectsAccService
    ) { }

    @Post()
    async addProject(@Req() req: any, @Body() body: CreateProjectDto, @Res() res: Response) {
        try {
            const projectAcc: ProjectsAcc = await this.projectAccService.get(res.locals.decoded.roleId)
            if (!projectAcc.add)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            validation.projectData(body)
            date_validation(body, ['start_date', 'end_date'])
            if (body.executiveOrganization != res.locals.decoded.organization && !res.locals.accessibility.all_organ_access)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CHANGE_DATA_FOR_ANOTHER_ORGAN)

            res.status(HttpStatus.CREATED).send(await this.projectService.save(body, Number(res.locals.decoded.id)))
            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.ADD_PROJECT,
                title: body.title,
                organization: userInfo.organization,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: ""
            })
        } catch (e) {
            console.error(e)
            if (e.code === 'ER_DUP_ENTRY') return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.DUBLICATE_DATA);
            else if (e.errno === 1452) {
                console.log(e)
                return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CANT_FIND_PROJECT);
            }
            else if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get('/:id')
    async getProject(@Param() param: any, @Body() body: any, @Res() res: Response) {
        try {
            const projectAcc: ProjectsAcc = await this.projectAccService.get(res.locals.decoded.roleId)
            const project = await this.projectService.findOne(param.id, {
                executiveOrganization: true,
                creator: true,
                location: true
            })
            if (!projectAcc.get && project.creator.id !== res.locals.decoded.id)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            if (project.executiveOrganization.id === res.locals.decoded.organization || res.locals.accessibility.all_organ_access)
                res.status(HttpStatus.ACCEPTED).send(project)
            else
                res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.NOT_FOR_YOUR_ORGAN)

        } catch (e) {
            console.error(e)
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Put('/:id')
    async updateProject(@Req() req: any, @Body() body: UpdateProjectDto, @Param() param: any, @Res() res: Response) {
        try {
            const projectAcc: ProjectsAcc = await this.projectAccService.get(res.locals.decoded.roleId)
            if (!projectAcc.add)
                return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)

            // check this user does have accessiblity to all organization data or not
            const project = await this.projectService.findOne(param.id, {
                cover: true,
                executiveOrganization: true,
                location: true
            })

            if (project.executiveOrganization.id !== res.locals.decoded.organization && !res.locals.accessibility.all_organ_access)
                return res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.NOT_FOR_YOUR_ORGAN)

            await this.projectService.updateById(body, param.id)

            res.status(HttpStatus.ACCEPTED).send(succssMessages.UPDATE_AN_RECORD)
            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.UPDATE_PROJECT,
                title: param.id,
                organization: userInfo.organization,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: ""
            })
        } catch (e) {
            console.log(e)
            if (e.isThrow) res.status(HttpStatus.METHOD_NOT_ALLOWED).send(e.extensions);
            else if (e.code === 'ER_DUP_ENTRY') res.status(HttpStatus.METHOD_NOT_ALLOWED).send('this project is already exist');
            else res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get('/:perPage/:page')
    async getProjects(@Param() param: any, @Query() query: any, @Body() body: any, @Res() res: Response) {
        try {
            const projectAcc = await this.projectAccService.get(res.locals.decoded.roleId)
            const count: number = await this.projectService
                .count(res.locals.decoded, res.locals.accessibility.all_organ_access, query, projectAcc)

            let pagination: IPaginationHelper = new paginationHelper({
                numberOfDataPerPage: Number(param.perPage),
                current_page_number: Number(param.page),
                short: true
            })
            
            res.status(HttpStatus.ACCEPTED).send({
                "count": count,
                "pages": pagination.getDetailsOfTheNumberOfPages(count),
                "current_page": Number(param.page),
                "data": await this.projectService.find({
                    page: param.page,
                    perPage: param.perPage
                }, res.locals.decoded, res.locals.accessibility.all_organ_access, query, projectAcc)
            })
        } catch (e) {
            console.log(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Delete('/:id')
    async deleteOrganization(@Param() param: any, @Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.projectService.delete(param.id as number) || [])
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }
}
