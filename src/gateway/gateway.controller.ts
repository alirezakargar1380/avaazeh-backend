import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ChargeGatewayDto } from './dto/create-gateway.dto';
// import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { Response } from 'express';
import { error_response } from 'src/shared/response/response';
import { WalletService } from 'src/wallet/wallet.service';

@Controller('gateway')
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly walletService: WalletService
  ) { }

  @Post('/wallet/charge')
  async charge_wallet(@Body() createGatewayDto: ChargeGatewayDto, @Res() res: Response) {
    res.status(HttpStatus.ACCEPTED).send(
      await this.gatewayService.charge_wallet(createGatewayDto.amount, res.locals.user.id)
    )
  }

  @Get('/verify')
  async verify(@Query() query: any, @Res() response: Response) {
    try {

      console.log(query.gateway)

      // if status was not ok, add the number of cart product to product
      if (query.Status === 'NOK')
        return response.redirect(`${process.env.ZARINPAL_REDIREC_LINK}?status=0`)

      // const donation = await this.donationsService.findOne(Number(query?.donationId))

      const gateway = await this.gatewayService.findOne(Number(query?.gateway))

      let RefID = await this.gatewayService.verify(query.Authority, gateway.charge_amount)
      console.log(RefID)

      const charge = await this.gatewayService.varify(gateway.id, {
        verified: true,
        ref_id: RefID,
        authority: query.Authority
      })

      await this.walletService.charge(charge.charge_amount, charge.user_id)

      // await this.gatewayService.updatePayed(donation.id, RefID)
      // response.status(HttpStatus.ACCEPTED).redirect(`${process.env.ZARINPAL_REDIREC_LINK}?status=1`)
      response.status(HttpStatus.ACCEPTED).send(`${process.env.ZARINPAL_REDIREC_LINK}?status=1`)

    } catch (e) {
      error_response(e, response)
    }
  }

  // @Get()
  // findAll() {
  //   return this.gatewayService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.gatewayService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGatewayDto: UpdateGatewayDto) {
  //   return this.gatewayService.update(+id, updateGatewayDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gatewayService.remove(+id);
  // }
}
