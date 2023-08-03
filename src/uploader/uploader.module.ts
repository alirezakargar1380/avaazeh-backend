import { Module } from '@nestjs/common';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uploader } from './entitys/uploader.entity';
import { JwtModule } from '@nestjs/jwt';
import { MultiUploaderService } from './multi_uploader.service';
import { MultiUploaderController } from './multi_uploader.controller';
import { Settings } from 'src/settings/entitys/settings.entitys';
import { SettingsService } from 'src/settings/settings.service';
import { Report } from 'src/report/entitys/report.entity';
import { ReportService } from 'src/report/report.service';
import { ReportStatus } from 'src/report_status/entitys/reportStatus.entity';
import { ReportStatusService } from 'src/report_status/report_status.service';
import { ReportImages } from 'src/report/entitys/report_images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Uploader, Settings, Report, ReportStatus, ReportImages]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [UploaderController, MultiUploaderController],
  providers: [
    UploaderService, MultiUploaderService, SettingsService, ReportService,
    ReportStatusService
  ]
})
export class UploaderModule { }
