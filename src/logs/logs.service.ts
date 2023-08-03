import { Injectable } from '@nestjs/common';
import { Logs } from './entity/logs.entitys';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateLog } from './dto/log.dto';
import p_date from './../shared/utils/persionDate.utility';
import paginationHelper from "pagination-helper";
import axios from 'axios';

@Injectable()
export class LogsService {
    constructor(
        @InjectRepository(Logs) private LogsRepository: Repository<Logs>
    ) { }

    async addLog(data: ICreateLog) {
        data.ip = await axios.get("https://api.ipify.org/").then(({data}: any) => {return data}).catch((e) => { return '' })
        await this.LogsRepository.save({
            ...data,
            date: p_date.year + "/" + p_date.month + "/" + p_date.day
        })
    }

    findOne(id: number) {
        return this.LogsRepository.findOne({
            where: {
                user: {
                    id: id
                }
            }
        })
    }

    find(perPage: number, page: number, accessibility: any) {
        let condition_organization: any = {}
        let condition_user: any = {} 

        if (accessibility.logsAcc.get) {
            condition_organization = { id: accessibility.organization }
        } else {
            condition_user = { id: accessibility.user_id }
        }

        if (accessibility.all_organ_access) {
            condition_organization = {}
        }

        let pagination = new paginationHelper({
            numberOfDataPerPage: perPage,
            current_page_number: page
        })

        return this.LogsRepository.find({
            where: {
                organization: condition_organization,
                user: condition_user
            },
            order: {
                id: "DESC"
            },
            relations: {
                role: true,
                organization: true,
                user: true
            },
            take: pagination.getTakeAndSkip().take,
            skip: pagination.getTakeAndSkip().skip
        })
    }

    count(accessibility: any) {
        let condition_organization: any = {}
        let condition_user: any = {}

        if (accessibility.logsAcc.get) {
            condition_organization = { id: accessibility.organization }
        } else {
            condition_user = { id: accessibility.user_id }
        }

        if (accessibility.all_organ_access) {
            condition_organization = {}
        }
        return this.LogsRepository.count({
            where: {
                organization: condition_organization,
                user: condition_user
            }
        })
    }
}
