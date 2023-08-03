import { Role } from "src/role/entitys/role.entity";

export interface CreateProjectAccDto {
    role: Role
    add: boolean
    get: boolean
}