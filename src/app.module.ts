import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { RoleModule } from './role/role.module';
import { AccessibilityModule } from './accessibility/accessibility.module';
import { Accessbility } from './accessibility/entitys/accessibility.entity';
import { SettingsAccModule } from './settings-acc/settings-acc.module';
import { AuthCodeModule } from './auth_code/auth_code.module';
import { FileManagerModule } from './file_manager/file_manager.module';
import { FilesModule } from './files/files.module';
import { LogsModule } from './logs/logs.module';
import { PageModule } from './page/page.module';
import { PackageModule } from './package/package.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.T_DB_HOST,
      port: 3306,
      username: process.env.T_DB_USERNAME,
      password: process.env.T_DB_PASSWORD,
      database: process.env.T_DB_DATABASE_NAME,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthenticationModule,
    AuthCodeModule,
    RoleModule,
    FileManagerModule, 
    FilesModule,
    // OrganizationModule,
    // ProjectModule,
    // ReportModule,
    // FinancialCreditModule,
    // ProjectStatusModule,
    // ProjectTypeModule,
    // ContractRateBasicsModule,
    // ReportStatusModule,
    // UploaderModule,
    // CityModule,
    // AccessibilityModule,
    // FinancialCreditSourcesModule,
    // SettingsModule,
    LogsModule,
    PageModule,
    PackageModule,
    OrdersModule,
    // ProjectsAccModule,
    // ReportsAccModule,
    // LogsAccModule,
    // RoleAccModule,
    // SettingsAccModule,
    // VariableSettingsAccModule,
    // UsersAccModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})

export class AppModule {}
