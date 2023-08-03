import { Controller, Post, Body, Res, HttpStatus, HttpException, Req, UseInterceptors, UploadedFile, UploadedFiles, Get, Param, Delete, } from '@nestjs/common';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer'
import { existsSync, mkdirSync, readFile, writeFile } from 'fs';
import { MultiUploaderService } from './multi_uploader.service';
import errorMessages from 'src/shared/constants/errorMessages';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { SettingsService } from 'src/settings/settings.service';
import { Settings } from 'src/settings/entitys/settings.entitys';
import { ReportService } from 'src/report/report.service';
import { Report } from 'src/report/entitys/report.entity';
import { UploaderService } from './uploader.service';
const sharp = require('sharp');
import * as fs from "fs";

@Controller('multi-uploader')
export class MultiUploaderController {
    constructor(
        private readonly multiUploaderService: MultiUploaderService,
        private readonly uploaderService: UploaderService,
        private readonly settingsService: SettingsService,
        private readonly reportService: ReportService,
        private jwtService: JwtService
    ) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 20, {
        fileFilter: (req: any, file: any, cb: any) => {
            // console.log(file)
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
    })
    )
    async multi_uploader(@UploadedFiles() files: any, @Res() res) {
        try {
            const insertMulti = []
            const settings: Settings = await this.settingsService.getSetting()
            if (settings.max_number_of_report_image < files.length) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send("max image num")
            for (let i = 0; i < files.length; i++) {
                const file: any = files[i];
                // read resize from settings
                sharp(`${file.destination}/${file.filename}`)
                    .rotate()
                    .resize(settings.quality)
                    .toBuffer()
                    .then((data) => {
                        writeFile(`${file.destination}/${file.filename}`, data, (err) => { if (err) throw err; })
                    })

                readFile(`${file.destination}/${file.filename}`, function (err, data) {
                    if (err) throw err;
                })

                // console.log(files)
                insertMulti.push({ link: `/multi-uploader/${file.filename}` })
                // console.log(`${process.env.SERVICE_ADDRESS}/multi-uploader/${file.filename}`)
            }

            const ids: number[] = []
            const uploadedImages: any = await this.multiUploaderService.create(insertMulti)
            uploadedImages.generatedMaps.forEach((id: number) => {
                ids.push(id)
            })
            res.status(HttpStatus.CREATED).send({
                ids: ids,
                images: await this.multiUploaderService.findMany(uploadedImages.generatedMaps)
            })
        } catch (e) {
            console.error(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }

    }

    @Get('/:imgPath/:token')
    seeUploadedFile(@Param('imgPath') image, @Param('token') token, @Res() res) {
        try {
            this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })
            res.sendFile(image, {
                root: './uploads'
            })
        } catch (error) {
            res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
        }
    }

    @Delete('/:token/:report_id/:image_id')
    async deleteImage(@Req() req: any, @Res() res, @Param() param: any) {
        try {
            this.jwtService.verify(param.token, { secret: process.env.JWT_AUTH_SECRET })
            const report: Report = await this.reportService.findOne(Number(param.report_id))
            // if (report.status) return res.status(HttpStatus.NOT_ACCEPTABLE).send("گزارش تایید شده قابل ویرایش نمیباشد")
            console.log("delete image")
            const image = await this.uploaderService.findOne(Number(param.image_id))
            const fileName: any = image.link.split('multi-uploader/')[1]
            console.log(fileName)
            console.log(fs.existsSync(`${__dirname}/../../uploads/${fileName}`))
            if (fs.existsSync(`${__dirname}/../../uploads/${fileName}`)) {
                fs.unlinkSync(`${__dirname}/../../uploads/${fileName}`);
                await this.uploaderService.deleteOne(Number(param.image_id))
            }

            res.status(HttpStatus.ACCEPTED).send("done!")
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
        }
    }
}
