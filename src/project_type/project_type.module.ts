import { Module } from '@nestjs/common';
import { ProjectTypeService } from './project_type.service';
import { ProjectTypeController } from './project_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectType } from './entitys/projectType.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectType])
  ],
  providers: [ProjectTypeService],
  controllers: [ProjectTypeController]
})
export class ProjectTypeModule {}
