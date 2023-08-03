import { Controller, Post, Body, Res, HttpStatus, Req, Get, Delete, Param } from '@nestjs/common';
import { Response } from 'express';
import { ProjectTypeService } from './project_type.service';
import errorMessages from 'src/shared/constants/errorMessages';

@Controller('project-type')
export class ProjectTypeController {
    constructor(
        private readonly projectTypeService: ProjectTypeService
    ) { }

    @Post()
    async add(@Body() body: any, @Res() res: Response) {
        try {
            return res.status(HttpStatus.ACCEPTED).send(await this.projectTypeService.create(body))
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Delete('/:id')
    async deleteProjectType(@Param() params, @Res() res: Response) {
        try {    
            res
            .status(HttpStatus.ACCEPTED)
            .send(await this.projectTypeService.delete(Number(params.id)));
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Get()
    async get(@Body() body: any, @Res() res: Response) {
        try {
            return res.status(HttpStatus.ACCEPTED).send(await this.projectTypeService.findAll())
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

}
