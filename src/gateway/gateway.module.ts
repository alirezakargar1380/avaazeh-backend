import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gateway } from './entities/gateway.entity';
import { JwtModule } from '@nestjs/jwt';
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { Wallets } from 'src/wallet/entities/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { Orders } from 'src/orders/entitys/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gateway, Wallets, Orders]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [GatewayController],
  providers: [GatewayService, WalletService]
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userLoginChecker).forRoutes({ path: 'gateway/wallet/charge', method: RequestMethod.POST })
  }
}
