import { Role } from "src/role/entitys/role.entity";

export interface CreateUsersAccDto {
    role: Role
    add: boolean
    get: boolean
}