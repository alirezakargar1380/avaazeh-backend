import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entitys/page.entity';
import { JwtModule } from '@nestjs/jwt';
import { adminChecker } from 'src/shared/middlewares/adminChecker.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Page
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [PageController],
  providers: [PageService]
})
export class PageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(adminChecker).forRoutes({ path: 'page/user/:id', method: RequestMethod.POST })
    consumer.apply(userLoginChecker).forRoutes({ path: 'page', method: RequestMethod.POST })
    consumer.apply(userLoginChecker).forRoutes({ path: 'page', method: RequestMethod.GET })
    consumer.apply(userLoginChecker).forRoutes({ path: 'page/:id/edit', method: RequestMethod.PUT })
    consumer.apply(adminChecker).forRoutes({ path: 'page/:id', method: RequestMethod.GET })
  }
}
