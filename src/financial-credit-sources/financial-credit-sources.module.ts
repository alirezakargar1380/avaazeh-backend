import { Module } from '@nestjs/common';
import { FinancialCreditSourcesService } from './financial-credit-sources.service';
import { FinancialCreditSourcesController } from './financial-credit-sources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialCreditSources } from './entitys/financial_credit_sources.entity';
import { Logs } from 'src/logs/entity/logs.entitys';
import { LogsService } from 'src/logs/logs.service';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { JwtModule } from '@nestjs/jwt';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';
import { AccessibilityService } from 'src/accessibility/accessibility.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialCreditSources, Logs, Accessbility]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  providers: [FinancialCreditSourcesService, LogsService, AccessibilityService],
  controllers: [FinancialCreditSourcesController]
})
export class FinancialCreditSourcesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes(FinancialCreditSourcesController)
  }
}
