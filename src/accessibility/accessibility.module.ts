import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccessibilityController } from './accessibility.controller';
import { AccessibilityService } from './accessibility.service';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Accessbility } from './entitys/accessibility.entity';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entitys/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Accessbility,
      Role
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [AccessibilityController],
  providers: [
    AccessibilityService,
    RoleService
  ]
})
export class AccessibilityModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes('accessibility')
  }
}
