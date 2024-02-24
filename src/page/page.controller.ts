import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { PageService } from './page.service';
import { error_response } from 'src/shared/response/response';
import { Response } from 'express';

@Controller('page')
export class PageController {
    constructor(
        private readonly pageService: PageService
    ) { }

    @Get('/')
    async getUserPages(@Res() res: Response) {
        try {
            const result = await this.pageService.getPage(res.locals.user)
            res.status(HttpStatus.CREATED).send(result);
        } catch (e) {
            error_response(e, res)
        }
    }

    @Get('/user/:id')
    async getUserPagesByid(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.pageService.getPage({ id })
            res.status(HttpStatus.CREATED).send(result);
        } catch (e) {
            error_response(e, res)
        }
    }

    @Post('/')
    async addPage(@Body() body: any, @Res() res: Response) {
        try {
            const result = await this.pageService.addPage(body, res.locals.user)
            res.status(HttpStatus.CREATED).send(result);
        } catch (e) {
            error_response(e, res)
        }
    }

    @Put('/:id/edit')
    async updatePage(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
        try {
            const result = await this.pageService.update(Number(id), body, res.locals.user)
            res.status(HttpStatus.CREATED).send(result);
        } catch (e) {
            error_response(e, res)
        }
    }
}
