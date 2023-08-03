import { Controller, Post, Body, Res, HttpStatus, HttpException, Req, UseInterceptors, UploadedFile, Get, Param, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer'
import { existsSync, mkdirSync, readFile, writeFile } from 'fs';
import { UploaderService } from './uploader.service';
import errorMessages from 'src/shared/constants/errorMessages';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { SettingsService } from 'src/settings/settings.service';
import { Settings } from 'src/settings/entitys/settings.entitys';
const sharp = require('sharp');

@Controller('uploader')
export class UploaderController {
    constructor(
        private readonly uploaderService: UploaderService,
        private readonly settingsService: SettingsService,
        private jwtService: JwtService
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req: any, file: any, cb: any) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                // Allow storage of file
                cb(null, true);
            } else {
                // Reject file
                cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
        },
        dest: './uploads',
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {
                const uploadPath = './uploads';
                // Create folder if doesn't exist
                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath);
                }
                cb(null, uploadPath);
            },
            // File modification details
            filename: (req: any, file: any, cb: any) => {
                const fileName: string = `${new Date().toDateString().toString() + "_" + uuidv4()}${extname(file.originalname)}`;
                // Calling the callback passing the random name generated with the original extension name
                cb(null, fileName);
            },
        }),
    }))
    async up(@UploadedFile() file, @Res() res) {
        try {
            const settings: Settings = await this.settingsService.getSetting()
            // read resize from settings
            sharp(`${file.destination}/${file.filename}`)
                .rotate()
                .resize(settings.quality)
                .toBuffer()
                .then((data) => {
                    writeFile(`${file.destination}/${file.filename}`, data, (err) => { if (err) throw err; })
                })

            // console.log(`${file.destination}/${file.filename}`)
            readFile(`${file.destination}/${file.filename}`, function (err, data) {
                if (err) throw err;
            })

            // console.log(file)
            // console.log(`${process.env.SERVICE_ADDRESS}/${file.destination}/${file.filename}`)
            res.send(await this.uploaderService.create(`/uploader/${file.filename}`))
        } catch (e) {
            console.error(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }

    }

    @Get('/:imgPath/:token')
    seeUploadedFile(@Param('imgPath') image, @Param('token') token, @Res() res) {
        try {
            this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })
            readFile(`./uploads/${image}`, function (err, data) {
                if (err) return res.send("")

                res.sendFile(image, {
                    root: './uploads'
                })
            })

        } catch (error) {
            console.log(error)
            res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
        }
    }

    
}
