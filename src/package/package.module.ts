import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entitys/package.entity';
import { JwtModule } from '@nestjs/jwt';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Package
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    }),
  ],
  controllers: [PackageController],
  providers: [PackageService]
})
export class PackageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes({ path: 'package', method: RequestMethod.POST })
  }
}
