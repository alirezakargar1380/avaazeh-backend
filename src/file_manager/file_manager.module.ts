import { Module } from '@nestjs/common';
import { FileManagerController } from './file_manager.controller';
import { FileManagerService } from './file_manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManager } from './entitys/file_manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileManager])
  ],
  controllers: [FileManagerController],
  providers: [FileManagerService]
})
export class FileManagerModule {}
