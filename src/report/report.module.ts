import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportStatus } from 'src/report_status/entitys/reportStatus.entity';
import { ReportStatusService } from 'src/report_status/report_status.service';
import { Report } from './entitys/report.entity';
import { ReportImages } from './entitys/report_images.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportImageService } from './report_image.service';
import { JwtModule } from '@nestjs/jwt';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { Project } from 'src/project/entitys/project.entity';
import { ProjectService } from 'src/project/project.service';
import { Logs } from 'src/logs/entity/logs.entitys';
import { LogsService } from 'src/logs/logs.service';
import { ReportsAccService } from 'src/reports-acc/reports-acc.service';
import { ReportsAcc } from 'src/reports-acc/entitys/reports.acc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report, ReportStatus, ReportImages, Accessbility, Project, Logs,
      ReportsAcc
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [ReportController],
  providers: [
    ReportService, ReportStatusService, ReportImageService,
    AccessibilityService, ProjectService, LogsService, 
    ReportsAccService
  ]
})
export class ReportModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes(ReportController)
  }
}
