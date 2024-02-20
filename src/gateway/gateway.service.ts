import { BadGatewayException, Injectable, MethodNotAllowedException } from '@nestjs/common';
// import { UpdateGatewayDto } from './dto/update-gateway.dto';
import zarinPalCheckout, { PaymentRequestInput, PaymentVerificationInput, create } from "zarinpal-checkout";
import { InjectRepository } from '@nestjs/typeorm';
import { Wallets } from 'src/wallet/entities/wallet.entity';
import { Repository } from 'typeorm';
import { Gateway } from './entities/gateway.entity';

@Injectable()
export class GatewayService {
  public api: any;
  constructor(@InjectRepository(Gateway) private gatewayRepository: Repository<Gateway>,) {
    this.api = {
      key: (process.env.ZARINPAL_TEST === "0") ? process.env.ZARINPAL_GATEWAY_CODE : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      sandbox: (process.env.ZARINPAL_TEST === "0") ? false : true
    }
  }
  create() {
    return 'This action adds a new gateway';
  }

  async charge_wallet(amount_toman: number, user_id: number) {
    const gateway = await this.gatewayRepository.save({
      charge_amount: amount_toman,
      user: {
        id: user_id
      }
    })

    const link: string = `http://localhost:4848/api/gateway/verify?gateway=${gateway.id}`
    // const link: string = `http://localhost:4848/api/gateway/verify`

    console.log(amount_toman, link)

    return await this.payZarinPal(amount_toman, link)
  }

  findAll() {
    return `This action returns all gateway`;
  }

  findOne(id: number) {
    return this.gatewayRepository.findOne({
      where: {
        id
      }
    })
  }

  async varify(id: number, data: any) {
    const gateway = await this.gatewayRepository.findOne({
      where: {
        id
      },
      relations: {
        user: true
      }
    })
  
    await this.gatewayRepository.update({
      id
    }, data)

    return {
      charge_amount: gateway.charge_amount,
      user_id: gateway.user.id
    }
  }

  // update(id: number, updateGatewayDto: UpdateGatewayDto) {
  //   return `This action updates a #${id} gateway`;
  // }

  remove(id: number) {
    return `This action removes a #${id} gateway`;
  }

  async payZarinPal(amount_toman: number, callbackUrl: string) {
    let customData: PaymentRequestInput = {
      Amount: amount_toman,
      CallbackURL: callbackUrl,
      Description: 'order payment',

    }
    console.log(this.api)
    const zarinpal = create(this.api.key, this.api.sandbox); // set sendbox true for test
    return await zarinpal.PaymentRequest(customData).then((response: any) => {
      if (response.status === 100) {
        return { link: response.url }
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
