import { Role } from "src/role/entitys/role.entity";

export interface CreateProjectAccessibilityDto {
    role: Role;
    create?: boolean;
    update?: boolean;
    read?: boolean;
    delete?: boolean;
}