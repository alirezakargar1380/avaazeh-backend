import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { User } from 'src/users/entitys/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallets } from './entities/wallet.entity';
import { Orders } from 'src/orders/entitys/orders.entity';
import { EOrderStatus } from 'src/orders/interface/order-status';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallets) private walletRepository: Repository<Wallets>,
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
  ) { }

  async payOrder(order_id: number, user_id: number) {
    const wallet = await this.walletRepository.findOne({
      where: {
        user: {
          id: user_id
        }
      }
    })

    

    const order = await this.ordersRepository.findOne({
      where: {
        id: order_id,
        user: {
          id: user_id
        },
        status: EOrderStatus.WATING_FOR_PAYMENT
      },
      relations: {
        package: true
      }
    })

    if (!order)
      throw new BadGatewayException('order not found')
    
    if (order.package.price > wallet.budget)
      throw new BadGatewayException("not enough money")

    wallet.budget -= order.package.price

    await this.walletRepository.update({
      user: {
        id: user_id
      }
    }, {
      budget: wallet.budget
    })

    /**
     * TODO: added wallet_log
     */

    await this.ordersRepository.update({
      id: order_id
    }, {
      status: EOrderStatus.WATING_FOR_ACCEPT
    })
  }

  create(user_id: number) {
    return this.walletRepository.save({
      budget: 0,
      user: {
        id: user_id
      }
    })
  }

  async charge(amount_toman: number, user_id: number) {
    const wallet = await this.walletRepository.findOne({
      where: {
        user: {
          id: user_id
        }
      }
    })

    wallet.budget += amount_toman

    return this.walletRepository.update({
      user: {
        id: user_id
      }
    }, {
      budget: wallet.budget
    })
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
