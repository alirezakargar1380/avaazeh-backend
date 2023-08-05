import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { AuthCode } from './entitys/auth_code.entity';
import { AuthCodeService } from './auth_code.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthCode
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [],
  providers: [AuthCodeService]
})
export class AuthCodeModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(userLoginChecker).forRoutes(CityController)
  }
}
