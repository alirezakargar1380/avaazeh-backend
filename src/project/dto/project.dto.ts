import { City } from "src/city/entitys/city.entity";
import { Organization } from "src/organization/entitys/organization.entity";
import { Uploader } from "src/uploader/entitys/uploader.entity";

export interface ProjectDto {
    id: number;
    project_code: string;
    title: string;
    _constructor: string;
    x: string;
    y: string;
    location: City;
    description: string;
    start_date: Date;
    decoded: any;
    end_date: Date;
    executiveOrganization: Organization;
    supervisoryOrganization: string;
    cover: Uploader;
}

export interface CreateProjectDto extends Omit<ProjectDto, 'id'> { }
export interface UpdateProjectDto extends Partial<ProjectDto> { }