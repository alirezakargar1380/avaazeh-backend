import { MiddlewareConsumer, Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallets } from './entities/wallet.entity';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { JwtModule } from '@nestjs/jwt';
import { Orders } from 'src/orders/entitys/orders.entity';
import { OrdersService } from 'src/orders/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallets, Orders
    ]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes(WalletController)
  }
}
