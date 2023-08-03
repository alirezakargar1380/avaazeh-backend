import { Role } from "src/role/entitys/role.entity";

export interface CreateLogsAccDto {
    role: Role
    get: boolean
}