import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entitys/report.entity';
import { Between, IsNull, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CreateReportDto, GetReportDto, ReportChart } from './dto/report.dto';
import p_date from './../shared/utils/persionDate.utility';
import { ReportStatus } from 'src/report_status/entitys/reportStatus.entity';
import { IPagination } from 'src/shared/types/pagination.type';
import { getPagination } from 'src/shared/utils/pagination.utils';
import Exception from 'src/shared/utils/error.utility';
import paginationHelper from "pagination-helper";
import { cond, groupBy } from 'lodash';
import persionDateUtility from './../shared/utils/persionDate.utility';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report) private reportRepository: Repository<Report>,
        @InjectRepository(ReportStatus) private reportStatusRepository: Repository<ReportStatus>
    ) { }

    create(data: CreateReportDto, projectId: number): Promise<Report> {
        return this.reportRepository.save({
            ...data,
            year: p_date.year,
            month: p_date.month,
            project: {
                id: projectId
            }
        })
    }

    async deleteByReportId(id: number) {
        await this.reportStatusRepository.delete({
            id: id
        })
        await this.reportRepository.delete({
            id: id,
        })
    }

    findOne(id: number): Promise<Report> {
        return this.reportRepository.findOne({
            where: { id: id },
            relations: { project: true, creator: true }
        })
    }

    async update(id: number, data: any) {
        if (!await this.findOne(id))
            throw Exception.setError('this report not found', true)
        this.reportRepository.update({ id }, data)
    }

    test() {
        return this.reportRepository.createQueryBuilder('report').select('(COUNT(CASE WHEN status="1" THEN 1 END) / COUNT(*)) * 100', 'totalVideos').addSelect('day').addGroupBy('day').getRawMany();
    }

    get_condition(details: GetReportDto) {
        let condition: any = {}

        if (!details.reportAcc.get)
            condition.creator = { id: details.user_data.id }
        if (details.reportAcc.get)
            condition.project = { executiveOrganization: { id: details.organ_id } }
        if (details.accessiblity.all_organ_access) {
            condition = {}
            // if (details.otherOrganization) {
            // condition.project = { executiveOrganization: { id: Not(details.organ_id) } }
            // } else {
            // condition.project = { executiveOrganization: { id: details.organ_id } }
            // }
            if (details.without_set_status) {
                condition.project = { executiveOrganization: { id: details.organ_id } }
            }
            if (details.query.executiveOrganization)
                condition.project = { ...condition.project, executiveOrganization: { id: details.query.executiveOrganization } }
        }

        if (details.accessiblity.admin_organ) {
            condition.status = true
        } else {
            // if user request to see other organ reports just show the status true reports
            if (details.query.executiveOrganization && details.query.executiveOrganization != details.organ_id.toString()) {
                condition.status = true
            } else {
                if (!details.my_reports)
                    condition.status = Not(IsNull())
                // else check the status query
                if (details.status === true || details.status === false)
                    condition.status = details.status

                if (details.status === null || details.without_set_status && details.reportAcc.set_status)
                    condition.status = IsNull()
            }
        }

        if (details.my_reports) condition.creator = { id: details.user_data.id }
        if (details.query.projectType)
            condition.projectType = { id: Number(details.query.projectType) }
        if (details.query.projectStatus)
            condition.projectStatus = { id: Number(details.query.projectStatus) }
        if (details.query.contractRateBasics)
            condition.contractRateBasics = { id: Number(details.query.contractRateBasics) }
        if (details.query.location)
            condition.project = {
                ...condition.project,
                location: {
                    id: Number(details.query.location)
                }
            }
        if (details.query.project)
            condition.project = { ...condition.project, id: Number(details.query.project) }
        if (details.query.project_code)
            condition.project = { ...condition.project, project_code: details.query.project_code }
        if (details.query.from_percentage_of_progress && details.query.to_percentage_of_progress)
            condition.percentage_of_progress = Between(Number(details.query.from_percentage_of_progress), Number(details.query.to_percentage_of_progress))
        if (details.query.according_to_schedule)
            condition.according_to_schedule = details.query.according_to_schedule

        return condition
    }

    get_reports(details: GetReportDto) {
        let condition: any = this.get_condition(details)
        // if (details.otherOrganization && details.query.executiveOrganization)
        //     return []

        let pagination = new paginationHelper({
            numberOfDataPerPage: Number(details.perPage),
            current_page_number: Number(details.page)
        })

        const takeAndSkip: any = pagination.getTakeAndSkip()
        return this.reportRepository.find({
            relations: {
                contractRateBasics: true,
                reportImages: {
                    image: true
                },
                creator: true,
                project: {
                    executiveOrganization: true,
                    location: true
                },
                projectType: true,
                projectStatus: true
            },
            where: condition,
            skip: takeAndSkip.skip,
            take: takeAndSkip.take,
            select: {
                id: true,
                according_to_schedule: true,
                percentage_of_progress_in_amount: true,
                contractRateBasics: {
                    title: true
                },
                percentage_of_progress: true,
                status: true,
                projectStatus: {
                    title: true
                },
                projectType: {
                    title: true
                },
                project: {
                    project_code: true,
                    id: true,
                    title: true
                },
                creator: { fullName: true },
                createdAt: true,
                description: true
            }
        })
    }

    count_reports(details: GetReportDto) {
        let condition: any = this.get_condition(details)

        return this.reportRepository.count({
            relations: {
                contractRateBasics: true,
                reportImages: {
                    image: true
                },
                creator: true,
                project: true,
                projectType: true,
                projectStatus: true
            },
            where: condition
        })
    }

    async get_sum(): Promise<ReportChart[]> {
        return await this.reportRepository
            .createQueryBuilder('report')
            .select('COUNT(*) AS numberOfReports')
            .addSelect('report.month')
            .where(`report.year = ${persionDateUtility.year}`)
            .groupBy('report.month')
            .getRawMany()
    }

    get_user_reports(user_id: number) {
        const pagination: IPagination = getPagination(1, 10)
        return this.reportRepository.createQueryBuilder('report').skip(pagination.skip).take(pagination.skip)
            .innerJoin('report.creator', 'creator', 'creator.id = :user_id', { user_id: user_id })
            .leftJoinAndSelect('report.project', 'project')
            .leftJoinAndSelect('report.projectStatus', 'projectStatus')
            .leftJoinAndSelect('report.projectType', 'projectType')
            .leftJoinAndSelect('report.contractRateBasics', 'contractRateBasics')
            .getMany()
    }

    get_one_reports(organ_id: number, id: number, all_organ_access: boolean) {
        let condition_data = {}
        if (!all_organ_access) {
            condition_data = {
                executiveOrganization: {
                    id: organ_id
                }
            }
        }

        // return this.reportRepository.createQueryBuilder('report').where('report.id = :id', { id: id })
        //     .innerJoin('report.creator', 'creator', condition, condition_data)
        //     .leftJoinAndSelect('report.projectStatus', 'projectStatus')
        //     .leftJoinAndSelect('report.projectType', 'projectType')
        //     .leftJoinAndSelect('report.contractRateBasics', 'contractRateBasics')
        //     .getOne()

        return this.reportRepository.findOne({
            relations: {
                creator: {
                    organization: true
                },
                project: {
                    executiveOrganization: true,
                    location: true,
                    cover: true
                },
                projectStatus: true,
                projectType: true,
                contractRateBasics: true
            },
            where: {
                id: id,
                project: condition_data
            }
        })
    }
}