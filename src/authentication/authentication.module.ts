import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./../users/entitys/users.entity";
import { AuthenticationController } from './authentication.controller';
import { Logs } from 'src/logs/entity/logs.entitys';
import { LogsService } from 'src/logs/logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Logs]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LogsService]

})
export class AuthenticationModule {} 
