import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { User } from "./entitys/users.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service"
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RoleService } from "src/role/role.service";
import { Role } from "src/role/entitys/role.entity";
import { Logs } from "src/logs/entity/logs.entitys";
import { LogsService } from "src/logs/logs.service";
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Logs, Accessbility]),
        JwtModule.register({
            secret: process.env.JWT_AUTH_SECRET,
            signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
        }),
    ],
    providers: [
        UsersService,
        RoleService,
        LogsService,
        AccessibilityService
    ],
    controllers: [UsersController]
})

export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(userLoginChecker).forRoutes(UsersController)
    }
}