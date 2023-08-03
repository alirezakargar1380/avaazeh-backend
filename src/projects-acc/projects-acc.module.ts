import { Module } from '@nestjs/common';
import { ProjectsAccService } from './projects-acc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsAcc } from './entitys/projects.acc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectsAcc
    ])
  ],
  providers: [ProjectsAccService]
})
export class ProjectsAccModule {}
