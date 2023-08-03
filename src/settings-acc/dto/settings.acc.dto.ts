import { Role } from "src/role/entitys/role.entity";

export interface CreateSettingsAccDto {
    role: Role
    add: boolean
    get: boolean
}