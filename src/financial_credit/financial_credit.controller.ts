import { Controller, Post, Body, Delete, Res, HttpStatus, Req, Get, Param } from '@nestjs/common';
import { FinancialCreditService } from './financial_credit.service';
import { Response, Request } from 'express';
import errorMessages from 'src/shared/constants/errorMessages';
import { financialCreditChart } from './entitys/financial_credit.dto';
import { PMonth } from 'src/shared/utils/persionDate.utility';
import financialCreditValidation from 'src/financial_credit/validation/financial_credit.validation';

@Controller('financial-credit') 
export class FinancialCreditController {
    constructor(
        private readonly financialCreditService: FinancialCreditService
    ) { }

    @Get('/chart')
    async aaa(@Param() param: any, @Body() body: any, @Res() res: Response) {
        try {
            let lables: string[] = []
            let dataset: number[] = []
            const data: financialCreditChart[] = await this.financialCreditService.get_sum()
            console.log(data)
            data.map((item: financialCreditChart) => {
                lables.push(PMonth[item.financial_credit_month])
                dataset.push(Number(item.numberOfReports))
            })
            
            res.send({
                lables: lables,
                dataset: dataset,
                data: data
            })
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Post('/:projectId')
    async addFinancialCredit(@Param('projectId') projectId, @Body() body: any, @Res() res: Response) {
        try {
            financialCreditValidation.add_data(body)
            res.status(HttpStatus.ACCEPTED).send(await this.financialCreditService.save(body, Number(projectId)))
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get('/:projectId')
    async get_financialCredit(@Param('projectId') projectId, @Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.financialCreditService.find(Number(projectId)))
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Get('/sum/all')
    async get_sum_all_financialCredit(@Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.financialCreditService.sum_all())
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }

    @Delete('/:id')
    async delete_financialCredit(@Param('id') id: number, @Res() res: Response) {
        try {
            console.log(id)
            res.status(HttpStatus.ACCEPTED).send(await this.financialCreditService.delete(Number(id)))
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessages.INTERNAL_SERVER)
        }
    }
}
