import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ReportStatusController } from './report_status.controller';
import { ReportStatusService } from './report_status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportStatus } from './entitys/reportStatus.entity';
import { ReportService } from 'src/report/report.service';
import { Report } from 'src/report/entitys/report.entity';
import { Project } from 'src/project/entitys/project.entity';
import { ProjectService } from 'src/project/project.service';
import { adminChecker } from 'src/shared/middlewares/adminChecker.middleware';
import { JwtModule } from '@nestjs/jwt';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { ReportsAcc } from 'src/reports-acc/entitys/reports.acc.entity';
import { ReportsAccService } from 'src/reports-acc/reports-acc.service';
import { Logs } from 'src/logs/entity/logs.entitys';
import { LogsService } from 'src/logs/logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportStatus,
      Report,
      Project,
      Accessbility,
      ReportsAcc,
      Logs
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [ReportStatusController],
  providers: [
    ReportStatusService, ReportService, ProjectService, AccessibilityService,
    ReportsAccService, LogsService
  ]
})

export class ReportStatusModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes('report-status')
  }
}
