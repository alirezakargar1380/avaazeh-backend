import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entitys/city.entity';
import { JwtModule } from '@nestjs/jwt';
import { Logs } from 'src/logs/entity/logs.entitys';
import { LogsService } from 'src/logs/logs.service';
import { VariableSettingsAcc } from 'src/variable_settings-acc/entitys/variable_settings.acc.entity';
import { VariableSettingsAccService } from 'src/variable_settings-acc/variable_settings-acc.service';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { AccessibilityService } from 'src/accessibility/accessibility.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      City, Logs, VariableSettingsAcc, Accessbility
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [CityController],
  providers: [CityService, LogsService, VariableSettingsAccService, AccessibilityService]
})

export class CityModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes(CityController)
  }
}
