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
        this.api = {
            key: (process.env.ZARINPAL_TEST === "0") ? process.env.ZARINPAL_GATEWAY_CODE : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            sandbox: (process.env.ZARINPAL_TEST === "0") ? false : true
        }
    }

    save(data) {
        return this.ordersRepository.save(data)
    }

    async payZarinPal(amount_toman: number, callbackUrl: string) {
        let customData: PaymentRequestInput = {
            Amount: amount_toman,
            CallbackURL: callbackUrl,
            Description: 'order payment'
        }
        const zarinpal = create(this.api.key, this.api.sandbox); // set sendbox true for test
        return await zarinpal.PaymentRequest(customData).then((response: any) => {
            if (response.status === 100) {
                return { token: response.authority, link: response.url }
            } else {
                throw new BadGatewayException('failed to get gateway')
            }
        }).catch((err: any) => {
            console.log(err)
            throw new MethodNotAllowedException('failed to get gateway from zarinpal')
        });
    }

    async verify(token: string, amount: number) {
        let customData: PaymentVerificationInput = {
            Amount: amount,
            Authority: token
        }
        const zarinpal = create(this.api.key, this.api.sandbox); // set sendbox true for test
        return zarinpal.PaymentVerification(customData).then((response: any) => {
            if (response.status === 100) {
                return response.RefID
            } else {
                throw new BadGatewayException('failed to verify')
            }
        }).catch((err: any) => {
            throw new MethodNotAllowedException('failed to verify from zarinpal')
        });
    }

}
