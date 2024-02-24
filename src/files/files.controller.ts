import { Controller, Get, HttpException, HttpStatus, Param, Put, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { existsSync, mkdirSync, readFile, writeFile } from 'fs';
import { diskStorage } from 'multer'
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileManagerService } from 'src/file_manager/file_manager.service';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly fileManagerService: FileManagerService
    ) { }

    @Put('/upload')
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
                const fileName: string = `${new Date().toDateString().toString() + "_" + uuidv4() + "_" + extname(file.originalname)}`;
                // Calling the callback passing the random name generated with the original extension name
                cb(null, fileName);
            },
        }),
    })
    )
    async multi_uploader(@UploadedFiles() files: any, @Res() res) {
        try {
            const insertMulti = []
            // if (settings.max_number_of_report_image < files.length) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send("max image num")
            for (let i = 0; i < files.length; i++) {
                const file: any = files[i];

                // read resize from settings
                console.log(file.filename)
                // sharp(`${file.destination}/${file.filename}`)
                //     .rotate()
                //     .resize(1080)
                //     .toBuffer()
                //     .then((data) => {
                //         writeFile(`${file.destination}/${file.filename}`, data, (err) => { if (err) throw err; })
                //     })

                // make sure file is created
                // readFile(`${file.destination}/${file.filename}`, function (err, data) {
                //     if (err) throw err;
                // })

                insertMulti.push({ name: file.filename })
            }
            
            const createdFiles: any = await this.filesService.insertMulti(insertMulti)
            const multiFileManagers = []
            // for (let i = 0; i < createdFiles.identifiers.length; i++) {
            //     const element: { id: number } = createdFiles.identifiers[i]
            //     multiFileManagers.push({
            //         file: element.id,
            //         belongsTo: 1
            //     })
            // }


            res.status(HttpStatus.CREATED).send(createdFiles)
        } catch (e) {
            console.error(e)
        }

    }

    @Get('/:imgPath/:token')
    seeUploadedFile(@Param('imgPath') image, @Param('token') token, @Res() res) {
        try {
            // this.jwtService.verify(token, { secret: process.env.JWT_AUTH_SECRET })
            res.sendFile(image, {
                root: './uploads'
            })
        } catch (error) {
            console.log(error)
            // res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.CANT_ACCESS_HERE)
        }
    }
}
