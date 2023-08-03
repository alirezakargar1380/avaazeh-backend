import { Test, TestingModule } from '@nestjs/testing';
import { ContractRateBasicsService } from './contract_rate_basics.service';

describe('ContractRateBasicsService', () => {
  let service: ContractRateBasicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractRateBasicsService],
    }).compile();

    service = module.get<ContractRateBasicsService>(ContractRateBasicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
