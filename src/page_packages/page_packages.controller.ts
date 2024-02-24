import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { PagePackagesService } from './page_packages.service';
import { Response } from 'express';

@Controller('page-packages')
export class PagePackagesController {
    constructor(
        private readonly service: PagePackagesService
    ) {}

    @Post()
    async addPackageToPage(@Body() body: any, @Res() res: Response) {
        try {
            await this.service.add(body)
            res.status(HttpStatus.ACCEPTED).send('doen')
        } catch(e) {

        }
    }
}
