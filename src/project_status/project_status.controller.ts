import { Controller, Post, Body, Res, HttpStatus, Req, Get, Delete, Param } from '@nestjs/common';
import { ProjectStatusService } from './project_status.service';
import { Response, Request } from 'express';
import errorMessages from 'src/shared/constants/errorMessages';

@Controller('project-status')
export class ProjectStatusController {
    constructor(
        private readonly projectStatusService: ProjectStatusService
    ) { }

    @Post()
    async add_projectStatus(@Body() body: any, @Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.projectStatusService.create(body));
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Delete('/:id')
    async deleteProjectStatus(@Param() params, @Res() res: Response) {
        try {    
            res
            .status(HttpStatus.ACCEPTED)
            .send(await this.projectStatusService.delete(Number(params.id)));
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Get()
    async get_projectStatus(@Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.projectStatusService.find())
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }
}
