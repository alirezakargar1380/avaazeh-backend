import { Module } from '@nestjs/common';
import { WalletLogsService } from './wallet_logs.service';
import { WalletLogsController } from './wallet_logs.controller';

@Module({
  controllers: [WalletLogsController],
  providers: [WalletLogsService]
})
export class WalletLogsModule {}
