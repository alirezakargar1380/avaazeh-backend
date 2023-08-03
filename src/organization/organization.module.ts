import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entitys/organization.entity';
import { VariableSettingsAcc } from 'src/variable_settings-acc/entitys/variable_settings.acc.entity';
import { VariableSettingsAccService } from 'src/variable_settings-acc/variable_settings-acc.service';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { JwtModule } from '@nestjs/jwt';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { Logs } from 'src/logs/entity/logs.entitys';
import { LogsService } from 'src/logs/logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization, VariableSettingsAcc, Accessbility, Logs
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  providers: [OrganizationService, VariableSettingsAccService, AccessibilityService, LogsService],
  controllers: [OrganizationController]
})
export class OrganizationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes(OrganizationController)
  }
}
