import { Organization } from "src/organization/entitys/organization.entity"
import { Role } from "src/role/entitys/role.entity"
import { User } from "src/users/entitys/users.entity"

export interface ICreateLog {
    action: string
    user: User
    role: Role
    organization: Organization
    title: string
    ip?: string
}

export interface IFindLogsOptions {
    
}