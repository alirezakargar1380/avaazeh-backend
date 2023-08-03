import { Role } from "src/role/entitys/role.entity";

export interface CreateVariableSettingsAccDto {
    role: Role
    add: boolean
    get: boolean
    delete: boolean
}