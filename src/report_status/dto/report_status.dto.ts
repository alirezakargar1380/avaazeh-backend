import { Report } from "src/report/entitys/report.entity";

export interface IReportStatus {
    id: number
    status: number
    description: string
}

export interface createReportStatus extends Omit<IReportStatus, "status" | "description"> {}