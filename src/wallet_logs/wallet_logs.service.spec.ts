import { Test, TestingModule } from '@nestjs/testing';
import { WalletLogsService } from './wallet_logs.service';

describe('WalletLogsService', () => {
  let service: WalletLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletLogsService],
    }).compile();

    service = module.get<WalletLogsService>(WalletLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
