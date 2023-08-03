import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entitys/role.entity';
import { adminChecker } from 'src/shared/middlewares/adminChecker.middleware';
import { JwtModule } from '@nestjs/jwt';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { Logs } from 'src/logs/entity/logs.entitys';
import { LogsService } from 'src/logs/logs.service';
import { ProjectsAcc } from 'src/projects-acc/entitys/projects.acc.entity';
import { ProjectsAccService } from 'src/projects-acc/projects-acc.service';
import { ReportsAcc } from 'src/reports-acc/entitys/reports.acc.entity';
import { LogsAcc } from 'src/logs-acc/entitys/logs.acc.entity';
import { UsersAcc } from 'src/users-acc/entitys/users.acc.entity';
import { VariableSettingsAcc } from 'src/variable_settings-acc/entitys/variable_settings.acc.entity';
import { SettingsAcc } from 'src/settings-acc/entitys/settings.acc.entity';
import { RoleAccService } from 'src/role-acc/role-acc.service';
import { ReportsAccService } from 'src/reports-acc/reports-acc.service';
import { RolesAcc } from 'src/role-acc/entitys/roles.acc.entity';
import { SettingsAccService } from 'src/settings-acc/settings-acc.service';
import { VariableSettingsAccService } from 'src/variable_settings-acc/variable_settings-acc.service';
import { UsersAccService } from 'src/users-acc/users-acc.service';
import { LogsAccService } from 'src/logs-acc/logs-acc.service';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role, Accessbility, Logs,
      ProjectsAcc,
      ReportsAcc,
      LogsAcc,
      UsersAcc,
      VariableSettingsAcc,
      SettingsAcc,
      RolesAcc
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [RoleController],
  providers: [
    RoleService, AccessibilityService, LogsService,
    ProjectsAccService,
    RoleAccService,
    ReportsAccService,
    SettingsAccService,
    VariableSettingsAccService,
    UsersAccService,
    LogsAccService
  ]
})

export class RoleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes(RoleController)
  }
}
