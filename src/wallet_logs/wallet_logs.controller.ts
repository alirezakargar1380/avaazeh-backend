import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletLogsService } from './wallet_logs.service';
import { CreateWalletLogDto } from './dto/create-wallet_log.dto';
import { UpdateWalletLogDto } from './dto/update-wallet_log.dto';

@Controller('wallet-logs')
export class WalletLogsController {
  constructor(private readonly walletLogsService: WalletLogsService) {}

  @Post()
  create(@Body() createWalletLogDto: CreateWalletLogDto) {
    return this.walletLogsService.create(createWalletLogDto);
  }

  @Get()
  findAll() {
    return this.walletLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletLogDto: UpdateWalletLogDto) {
    return this.walletLogsService.update(+id, updateWalletLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletLogsService.remove(+id);
  }
}
