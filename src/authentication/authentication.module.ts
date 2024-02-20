import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./../users/entitys/users.entity";
import { AuthenticationController } from './authentication.controller';
import { AuthCode } from 'src/auth_code/entitys/auth_code.entity';
import { AuthCodeService } from 'src/auth_code/auth_code.service';
import { Role } from 'src/role/entitys/role.entity';
import { RoleService } from 'src/role/role.service';
import { UsersService } from 'src/users/users.service';
import { Wallets } from 'src/wallet/entities/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { Orders } from 'src/orders/entitys/orders.entity';
import { OrdersService } from 'src/orders/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthCode, Role, Wallets, Orders]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthCodeService,  WalletService, RoleService, UsersService, OrdersService]

})
export class AuthenticationModule {} 
