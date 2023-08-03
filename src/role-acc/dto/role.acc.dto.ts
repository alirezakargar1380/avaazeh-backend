import { Role } from "src/role/entitys/role.entity";

export interface CreateRoleAccDto {
    role: Role
    add: boolean
    get: boolean
}