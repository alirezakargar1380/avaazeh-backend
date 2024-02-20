import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entitys/role.entity';
import { adminChecker } from 'src/shared/middlewares/adminChecker.middleware';
import { JwtModule } from '@nestjs/jwt';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
  ]
})

export class RoleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes(RoleController)
  }
}
