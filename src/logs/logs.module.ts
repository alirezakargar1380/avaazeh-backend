import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './entity/logs.entitys';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { JwtModule } from '@nestjs/jwt';
import { LogsAcc } from 'src/logs-acc/entitys/logs.acc.entity';
import { LogsAccService } from 'src/logs-acc/logs-acc.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Logs, Accessbility, LogsAcc]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  
  controllers: [LogsController],
  providers: [LogsService, AccessibilityService, LogsAccService]
})
export class LogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(userLoginChecker)
      .forRoutes(LogsController);
  }
}
