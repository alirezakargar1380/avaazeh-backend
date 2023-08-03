import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entitys/project.entity';
import { JwtModule } from '@nestjs/jwt';
import { projectSectionAccessibilityMiddleware } from './project.middleware';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { LogsService } from 'src/logs/logs.service';
import { Logs } from 'src/logs/entity/logs.entitys';
import { ProjectsAcc } from 'src/projects-acc/entitys/projects.acc.entity';
import { ProjectsAccService } from 'src/projects-acc/projects-acc.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Accessbility, Logs, ProjectsAcc]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [ProjectController],
  providers: [ProjectService, AccessibilityService, LogsService, ProjectsAccService]
})

export class ProjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(projectSectionAccessibilityMiddleware).forRoutes({ path: 'project', method: RequestMethod.POST })
    consumer.apply(projectSectionAccessibilityMiddleware).forRoutes({ path: 'project/:perPage/:page', method: RequestMethod.GET })
    consumer.apply(projectSectionAccessibilityMiddleware).forRoutes({ path: 'project/:id', method: RequestMethod.GET })
    consumer.apply(projectSectionAccessibilityMiddleware).forRoutes({ path: 'project/:id', method: RequestMethod.PUT })
  }
}
