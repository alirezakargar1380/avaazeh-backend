import { ContractRateBasics } from "src/contract_rate_basics/entitys/ContractRateBasics.entity";
import { Project } from "src/project/entitys/project.entity";
import { ProjectStatus } from "src/project_status/entitys/project_status.entity";
import { ProjectType } from "src/project_type/entitys/projectType.entity";
import { ReportsAcc } from "src/reports-acc/entitys/reports.acc.entity";
import { ReportStatus } from "src/report_status/entitys/reportStatus.entity";
import { User } from "src/users/entitys/users.entity";

export interface ReportChart {
    numberOfReports: string
    report_month: number
}

export interface GetReportDto {
    status?: null | boolean
    organ_id: number
    user_data: any
    accessiblity: any
    projectId?: string
    perPage?: number
    page?: string
    without_set_status?: boolean
    my_reports?: boolean
    reportAcc: ReportsAcc
    query: ReportQueryDto
}

export interface ReportDto {
    id: number,
    project: Project,
    percentage_of_progress: number,
    according_to_schedule: number,
    description: string,
    projectStatus: ProjectStatus,
    reportStatus: ReportStatus,
    creator: User,
    projectType: ProjectType,
    contractRateBasics: ContractRateBasics,
    year: number,
    month: number
}

export interface ReportQueryDto {
    my_organ?: string
    status?: string
    project_code?: string
    contractRateBasics?: string
    projectStatus?: string
    projectType?: string
    project?: string
    location?: string
    otherOrganization?: string
    from_percentage_of_progress?: string
    to_percentage_of_progress?: string
    according_to_schedule?: string
    executiveOrganization?: string
}

export interface ReportParamsDto {
    perPage: number
    page: string
    projectStatus: string
    projectType: string
    contractRateBasics: string
}

export interface CreateReportDto extends Omit<ReportDto, 'id'> { }
export interface UpdateReportDto extends Partial<CreateReportDto> { }

