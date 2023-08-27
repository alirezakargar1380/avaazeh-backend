import { Body, Controller, Get, Post, Res, HttpStatus, Param, Query, Put, Req } from "@nestjs/common";
import { CreateUserDto, LoginUserDto, UsersChart } from "./dto/users.dto";
import { User } from "./entitys/users.entity";
import { UsersService } from "./users.service";
import { Response } from 'express';
import { RoleService } from "src/role/role.service";
import { Role } from "src/role/entitys/role.entity";
import errorMessages from "src/shared/constants/errorMessages";
import { LogsService } from "src/logs/logs.service";
import logsActions from "src/shared/constants/logsActions";
import { AccessibilityService } from "src/accessibility/accessibility.service";
import { Accessbility } from "src/accessibility/entitys/accessibility.entity";
import validation from "src/users/validation/users.validation"
import succssMessages from "src/shared/constants/succssMessages";
import paginationHelper, { IPaginationHelper } from "pagination-helper";
import { PMonth } from "src/shared/utils/persionDate.utility";

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly roleService: RoleService,
        private readonly logsService: LogsService,
        private readonly accessibilityService: AccessibilityService
    ) { }

    // @Get('/chart')
    // async GetChart(@Req() req: any, @Res() res: Response) {
    //     try {
    //         let lables: string[] = []
    //         let dataset: number[] = []
    //         const data: UsersChart[] = await this.userService.get_sum() 

    //         data.map((item: UsersChart) => {
    //             lables.push(PMonth[item.user_month])
    //             dataset.push(Number(item.numberOfReports))
    //         })
            
    //         res.send({
    //             lables: lables,
    //             dataset: dataset,
    //             data: data
    //         })
    //     } catch (e) {
    //         console.error(e)
    //         if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
    //         res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER);
    //     }
    // }

    @Post()
    async addUser(@Req() req: any, @Body() body: CreateUserDto, @Res() res: Response) {
        try {
            validation.userData(body)

            const role: Role = await this.roleService.findOneById(body.role)
            if (!role) throw new Error('این نقش انتخاب شده وجود ندارد')

            const accessibility = await this.accessibilityService.findOneAccessiblityByRoleId(role.id)
            if (!res.locals.accessibility.all_organ_access) {
                if (accessibility.all_organ_access)
                    return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CANT_ACCESS_TO_ALL_ORGAN)
            }

            const createdUser: User = await this.userService.save(body)
            res.status(HttpStatus.CREATED).send(createdUser);

            const userInfo = res.locals.decoded
            this.logsService.addLog({
                action: logsActions.ADD_USER,
                title: body.username,
                role: userInfo.roleId,
                user: userInfo.id,
                ip: req.connection.remoteAddress
            })

        } catch (e) {
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            if (e.code === 'ER_DUP_ENTRY') return res.status(HttpStatus.METHOD_NOT_ALLOWED).send('این کاربر درحال حاضر وجود دارد');
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Put("/password")
    async changeUserPass(@Req() req: any, @Body() body: any, @Res() res: Response) {
        try {
            validation.updatePassword(body)
            if (body.password !== body.newPassword)
                return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.PASSWORDS_ARE_NOT_SAME)

            const userInfo = res.locals.decoded
            await this.userService.updatePassword(userInfo.id, body.password)

            await this.logsService.addLog({
                action: logsActions.UPDATE_PROFILE_DETAILS,
                title: "",
                role: userInfo.roleId,
                user: userInfo.id,
                ip: req.connection.remoteAddress
            })

            res.status(HttpStatus.ACCEPTED).send(succssMessages.UPDATE_AN_RECORD)
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Get("/:perPage/:page")
    async getUsers(@Param() param: any, @Query() query: any, @Res() res: Response) {
        try {
            const count: number = await this.userService.count(query)

            let pagination: IPaginationHelper = new paginationHelper({
                numberOfDataPerPage: Number(param.perPage),
                current_page_number: Number(param.page),
                short: true
            })

            res.status(HttpStatus.ACCEPTED).send({
                count: count,
                pages: pagination.getDetailsOfTheNumberOfPages(count),
                data: await this.userService.findAll(Number(param.perPage), Number(param.page), query)
            })

        } catch (e) {
            console.error(e)
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Get("/:user_id")
    async getOneUsers(@Param('user_id') userId: number, @Query() query: any, @Res() res: Response) {
        try {
            console.log(userId)
            // const usersAcc: UsersAcc = await this.usersAccService.get(res.locals.decoded.roleId)
            // if (!usersAcc.get)
            //     return res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)

            // const all_organ_access: Accessbility = await this.accessibilityService.findOneAccessiblityByRoleId(res.locals.decoded.roleId)
            res.status(HttpStatus.ACCEPTED).send(await this.userService.findOne(userId))

        } catch (e) {
            console.error(e)
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Put("/:user_id")
    async updateOneUsers(@Param('user_id') userId: number, @Body() body: CreateUserDto, @Query() query: any, @Res() res: Response) {
        try {
            console.log(userId)
            // const usersAcc: UsersAcc = await this.usersAccService.get(res.locals.decoded.roleId)
            // if (!usersAcc.get)
            //     return res.status(HttpStatus.NOT_ACCEPTABLE).send(errorMessages.CANT_ACCESS_HERE)

            // const all_organ_access: Accessbility = await this.accessibilityService.findOneAccessiblityByRoleId(res.locals.decoded.roleId)
            res.status(HttpStatus.ACCEPTED).send(await this.userService.update(userId, body))

        } catch (e) {
            console.error(e)
            if (e.isThrow) return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
            if (e.code === 'ER_DUP_ENTRY') return res.status(HttpStatus.METHOD_NOT_ALLOWED).send('this user is already exist');
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER);
        }
    }
}