import { Test, TestingModule } from '@nestjs/testing';
import { WalletLogsController } from './wallet_logs.controller';
import { WalletLogsService } from './wallet_logs.service';

describe('WalletLogsController', () => {
  let controller: WalletLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletLogsController],
      providers: [WalletLogsService],
    }).compile();

    controller = module.get<WalletLogsController>(WalletLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
