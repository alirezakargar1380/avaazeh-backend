export interface CreateOrganizationDto {
    organization_name: string;
}

export class DeleteOrganizationDto {
    id: number;
}

export class GetOrganizationDto {
    page: number;
    perPage: number;
}