import { Injectable } from '@nestjs/common';
import { CreateWalletLogDto } from './dto/create-wallet_log.dto';
import { UpdateWalletLogDto } from './dto/update-wallet_log.dto';

@Injectable()
export class WalletLogsService {
  create(createWalletLogDto: CreateWalletLogDto) {
    return 'This action adds a new walletLog';
  }

  findAll() {
    return `This action returns all walletLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletLog`;
  }

  update(id: number, updateWalletLogDto: UpdateWalletLogDto) {
    return `This action updates a #${id} walletLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletLog`;
  }
}
