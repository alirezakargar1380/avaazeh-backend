import { Role } from "src/role/entitys/role.entity";

export interface CreateReportAccDto {
    role: Role
    add: boolean
    get: boolean
    set_status: boolean
}