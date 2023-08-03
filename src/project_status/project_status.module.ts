import { Module } from '@nestjs/common';
import { ProjectStatusController } from './project_status.controller';
import { ProjectStatusService } from './project_status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectStatus } from './entitys/project_status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectStatus])
  ],
  controllers: [ProjectStatusController],
  providers: [ProjectStatusService]
})
export class ProjectStatusModule {}
