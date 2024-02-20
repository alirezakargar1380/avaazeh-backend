import { BadGatewayException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Orders } from './entitys/orders.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import zarinPalCheckout, { PaymentRequestInput, PaymentVerificationInput, create } from "zarinpal-checkout";
@Injectable()
export class OrdersService {
    public api: any;
    constructor(
        @InjectRepository(Orders) private ordersRepository: Repository<Orders>
    ) {
        
    }

    save(data: any, user_id: number) {
        return this.ordersRepository.save({
            ...data,
            user: {
                id: user_id
            }
        })
    }

    findUserOrders(user_id: number) {
        return this.ordersRepository.find({
            where: {
                user: {
                    id: user_id
                }
            }
        })
    }

}
