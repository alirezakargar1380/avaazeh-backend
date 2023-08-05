import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { Files } from './entitys/files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManagerService } from 'src/file_manager/file_manager.service';
import { FileManager } from 'src/file_manager/entitys/file_manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Files, FileManager])
  ],
  providers: [FilesService, FileManagerService],
  controllers: [FilesController]
})
export class FilesModule { }
