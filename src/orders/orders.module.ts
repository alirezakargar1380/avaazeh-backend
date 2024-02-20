import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entitys/orders.entity';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes(OrdersController)
  }
}
