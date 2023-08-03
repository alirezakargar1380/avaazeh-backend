import { Body, Param, Controller, Get, Post, Put, Query, Delete, Res, HttpStatus } from "@nestjs/common";
import { SettingsService } from './settings.service';
import { Response } from 'express';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    async getProject(@Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.settingsService.getSetting())
        } catch (error) {
            console.log(error)
            res.send('internal')
        }
    }

    @Put()
    async update(@Body() body: any, @Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.settingsService.update(body))
        } catch (error) {
            console.log(error)
            res.send('internal')
        }
    }
}
