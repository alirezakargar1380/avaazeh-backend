import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entitys/users.entity';
import { AuthenticationModule } from './authentication/authentication.module';
import { RoleModule } from './role/role.module';
import { Role } from './role/entitys/role.entity';
import { Organization } from './organization/entitys/organization.entity';
import { OrganizationModule } from './organization/organization.module';
import { ProjectModule } from './project/project.module';
import { Project } from './project/entitys/project.entity';
import { ReportModule } from './report/report.module';
import { FinancialCreditModule } from './financial_credit/financial_credit.module';
import { Report } from './report/entitys/report.entity';
import { ProjectStatusModule } from './project_status/project_status.module';
import { ProjectTypeModule } from './project_type/project_type.module';
import { ContractRateBasicsModule } from './contract_rate_basics/contract_rate_basics.module';
import { ReportStatusModule } from './report_status/report_status.module';
import { ReportStatus } from './report_status/entitys/reportStatus.entity';
import { UploaderModule } from './uploader/uploader.module';
import { Uploader } from './uploader/entitys/uploader.entity';
import { ReportImages } from './report/entitys/report_images.entity';
import { CityModule } from './city/city.module';
import { City } from './city/entitys/city.entity';
import { AccessibilityModule } from './accessibility/accessibility.module';
import { Accessbility } from './accessibility/entitys/accessibility.entity';
import { FinancialCreditSourcesModule } from './financial-credit-sources/financial-credit-sources.module';
import { SettingsModule } from './settings/settings.module';
import { Settings } from './settings/entitys/settings.entitys';
import { LogsModule } from './logs/logs.module';
import { Logs } from './logs/entity/logs.entitys';
import { ProjectsAccModule } from './projects-acc/projects-acc.module';
import { ReportsAccModule } from './reports-acc/reports-acc.module';
import { LogsAccModule } from './logs-acc/logs-acc.module';
import { RoleAccModule } from './role-acc/role-acc.module';
import { SettingsAccModule } from './settings-acc/settings-acc.module';
import { VariableSettingsAccModule } from './variable_settings-acc/variable_settings-acc.module';
import { UsersAccModule } from './users-acc/users-acc.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.T_DB_HOST,
      port: 3306,
      username: process.env.T_DB_USERNAME,
      password: process.env.T_DB_PASSWORD,
      database: process.env.T_DB_DATABASE_NAME,  
      entities: [
        User,
        Role,
        Organization,
        Project,
        Report,
        ReportStatus,
        Uploader,
        ReportImages,
        City,
        Accessbility,
        Settings,
        Logs
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthenticationModule,
    RoleModule,
    OrganizationModule,
    ProjectModule,
    ReportModule,
    FinancialCreditModule,
    ProjectStatusModule,
    ProjectTypeModule,
    ContractRateBasicsModule,
    ReportStatusModule,
    UploaderModule,
    CityModule,
    AccessibilityModule,
    FinancialCreditSourcesModule,
    SettingsModule,
    LogsModule,
    ProjectsAccModule,
    ReportsAccModule,
    LogsAccModule,
    RoleAccModule,
    SettingsAccModule,
    VariableSettingsAccModule,
    UsersAccModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})

export class AppModule {}
