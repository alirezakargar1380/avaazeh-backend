import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { User } from "./entitys/users.entity";
import { UserController, UsersController } from "./users.controller";
import { UsersService } from "./users.service"
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RoleService } from "src/role/role.service";
import { Role } from "src/role/entitys/role.entity";
import { userLoginChecker } from 'src/shared/middlewares/userLoginChecker.middleware';
import { AccessibilityService } from 'src/accessibility/accessibility.service';
import { Accessbility } from 'src/accessibility/entitys/accessibility.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Accessbility]),
        JwtModule.register({
            secret: process.env.JWT_AUTH_SECRET,
            signOptions: { expiresIn: process.env.JWT_AUTH_TIME },
        }),
    ],
    providers: [
        UsersService,
        RoleService,
        AccessibilityService
    ],
    controllers: [UsersController, UserController]
})

export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(userLoginChecker).forRoutes(UsersController)
        consumer.apply(userLoginChecker).forRoutes(UserController)
    }
}