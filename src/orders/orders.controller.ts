import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Response, response } from 'express';
import { error_response } from 'src/shared/response/response';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ) { }

    @Post()
    async addOrder(@Body() body, @Res() response: Response) {
        try {
            const createdData = await this.ordersService.save(body)
            response.status(HttpStatus.CREATED)
                .send({
                    gateway: await this.ordersService.payZarinPal(body.price, "http://localhost:4848/api/orders/verify?amount=" + body.price),
                    created: createdData,
                })

        } catch (e) {
            error_response(e, response)
        }
    }

    @Get('/verify')
    async verify(@Query() query: any, @Res() response: Response) {
        try {
            // if status was not ok, add the number of cart product to product
            if (query.Status === 'NOK')
                return response.redirect(`${process.env.ZARINPAL_REDIREC_LINK}?status=0`)

            // const donation = await this.donationsService.findOne(Number(query?.donationId))

            let RefID = await this.ordersService.verify(query.Authority, Number(query.amount))

            // await this.gatewayService.updatePayed(donation.id, RefID)
            response.status(HttpStatus.ACCEPTED).redirect(`${process.env.ZARINPAL_REDIREC_LINK}?status=1`)

        } catch (e) {
            error_response(e, response)
        }
    }

}
