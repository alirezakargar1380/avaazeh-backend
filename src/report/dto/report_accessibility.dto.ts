import { Role } from "./../../role/entitys/role.entity";

export interface CreateReportAccessibilityDto {
    role: number;
    create?: number;
    update?: boolean;
    read?: boolean;
    delete?: boolean;
}