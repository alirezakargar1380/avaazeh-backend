import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Response } from 'express';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async wallet_details(@Res() res: Response) {
    try {
      res.status(HttpStatus.ACCEPTED).send(await this.walletService.get_wallet_details(res.locals.user.id))
    } catch(e) {
      res.status(HttpStatus.BAD_GATEWAY).send(e)
    }
  }

  @Put()
  async update_wallet_details(@Body() body: any, @Res() res: Response) {
    try {
      await this.walletService.update_wallet_details(res.locals.user.id, body)
      res.status(HttpStatus.ACCEPTED).send(await this.walletService.get_wallet_details(res.locals.user.id))
    } catch(e) {
      res.status(HttpStatus.BAD_GATEWAY).send(e)
    }
  }

  @Post('/pay/order/:id')
  async payOrder(@Param('id') order_id: string, @Res() res: Response) {
    try {

      await this.walletService.payOrder(Number(order_id), res.locals.user.id)
      res.status(HttpStatus.ACCEPTED).send("your order was sussessfully payed")
    } catch(e) {
      res.status(HttpStatus.BAD_GATEWAY).send(e)
    }
  }

  // @Get()
  // findAll() {
  //   return this.walletService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.walletService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
  //   return this.walletService.update(+id, updateWalletDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.walletService.remove(+id);
  // }
}
