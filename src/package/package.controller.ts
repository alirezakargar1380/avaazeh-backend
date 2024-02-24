import { Controller, Body, Get, Res, HttpStatus, Post, Param, Put } from '@nestjs/common';
import { PackageService } from './package.service';
import { error_response } from 'src/shared/response/response';
import { Response } from 'express';

@Controller('package')
export class PackageController {
    constructor(
        private readonly packageService: PackageService
    ) { }

    @Post()
    async addPackage(@Body() body, @Res() res: Response) {
        try {
            /**
             * TODO:
             *    - CHECK USER IS ADMIN OR NOT
             */
            res.status(HttpStatus.ACCEPTED).send(await this.packageService.save(res.locals.user, body))
        } catch (e) {
            error_response(e, res)
        }
    }

    @Get()
    async getPackages(@Body() body, @Res() res: Response) {
        try {
            const packages = await this.packageService.getAll()

            res.status(HttpStatus.ACCEPTED).send(packages)
        } catch (e) {
            error_response(e, res)
        }
    }

    @Get('/user/:id')
    async getUserPackages(@Param('id') id: string, @Body() body, @Res() res: Response) {
        try {
            const packages = await this.packageService.getAllUserPackages(Number(id))

            res.status(HttpStatus.ACCEPTED).send(packages)
        } catch (e) {
            error_response(e, res)
        }
    }

    @Put('/:id/edit')
    async updatePage(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
        try {
            const result = await this.packageService.update(Number(id), body)
            res.status(HttpStatus.CREATED).send(result);
        } catch (e) {
            error_response(e, res)
        }
    }
}
