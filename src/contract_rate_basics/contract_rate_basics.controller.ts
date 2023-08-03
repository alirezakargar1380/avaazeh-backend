import { Controller, Post, Body, Res, HttpStatus, Req, Get, Delete, Param } from '@nestjs/common';
import { ContractRateBasicsService } from './contract_rate_basics.service';
import { Response } from 'express';
import errorMessages from 'src/shared/constants/errorMessages';

@Controller('contract-rate-basics')
export class ContractRateBasicsController {
    constructor(
        private readonly cRBService: ContractRateBasicsService
    ) { }

    @Post()
    async addCRB(@Body() body: any, @Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.cRBService.create(body));
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Delete('/:id')
    async deleteProjectType(@Param() params, @Res() res: Response) {
        try {    
            res
            .status(HttpStatus.ACCEPTED)
            .send(await this.cRBService.delete(Number(params.id)));
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }

    @Get()
    async getCRB(@Res() res: Response) {
        try {
            res.status(HttpStatus.ACCEPTED).send(await this.cRBService.findAll());
        } catch (e) {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.INTERNAL_SERVER);
        }
    }
}
