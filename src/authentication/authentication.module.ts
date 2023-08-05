import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./../users/entitys/users.entity";
import { AuthenticationController } from './authentication.controller';
import { Logs } from 'src/logs/entity/logs.entitys';
import { LogsService } from 'src/logs/logs.service';
import { AuthCode } from 'src/auth_code/entitys/auth_code.entity';
import { AuthCodeService } from 'src/auth_code/auth_code.service';
import { Role } from 'src/role/entitys/role.entity';
import { RoleService } from 'src/role/role.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Logs, AuthCode, Role]),
    JwtModule.register({
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
    })
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LogsService, AuthCodeService, RoleService, UsersService]

})
export class AuthenticationModule {} 
