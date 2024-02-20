import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Response, response } from 'express';
import { error_response } from 'src/shared/response/response';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ) { }

    @Get()
    async getUserOrders(@Res() response: Response) {
        const order = await this.ordersService.findUserOrders(response.locals.user.id)
        response
                .status(HttpStatus.CREATED)
                .send(order)
    }

    @Post()
    async addOrder(@Body() body, @Res() response: Response) {
        try {
            const order = await this.ordersService.save(body, response.locals.user.id)
            response
                .status(HttpStatus.CREATED)
                .send(order)

        } catch (e) {
            error_response(e, response)
        }
    }

    // @Get('/verify')
    // async verify(@Query() query: any, @Res() response: Response) {
    //     try {
    //         // if status was not ok, add the number of cart product to product
    //         if (query.Status === 'NOK')
    //             return response.redirect(`${process.env.ZARINPAL_REDIREC_LINK}?status=0`)

    //         // const donation = await this.donationsService.findOne(Number(query?.donationId))

    //         let RefID = await this.ordersService.verify(query.Authority, Number(query.amount))

    //         // await this.gatewayService.updatePayed(donation.id, RefID)
    //         response.status(HttpStatus.ACCEPTED).redirect(`${process.env.ZARINPAL_REDIREC_LINK}?status=1`)

    //     } catch (e) {
    //         error_response(e, response)
    //     }
    // }

}
