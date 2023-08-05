import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { FileManagerService } from './file_manager.service';
import { Response } from 'express';
import { error_response } from 'src/shared/response/response';

@Controller('file-manager')
export class FileManagerController {
    constructor(
        private readonly fileManagerService: FileManagerService 
    ) { }

    @Get()
    async getFileManager(@Res() response: Response) {
        try {
            response.status(HttpStatus.ACCEPTED).send(await this.fileManagerService.findAll())
        } catch (e) {
            error_response(e, response)
        } 
    }
}
