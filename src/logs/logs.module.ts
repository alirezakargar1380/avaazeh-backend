import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './entity/logs.entitys';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Logs, Accessbility]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  
  controllers: [LogsController],
  providers: [LogsService, AccessibilityService]
})
export class LogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(userLoginChecker)
      .forRoutes(LogsController);
  }
}
