import { Test, TestingModule } from '@nestjs/testing';
import { FinancialCreditSourcesService } from './financial-credit-sources.service';

describe('FinancialCreditSourcesService', () => {
  let service: FinancialCreditSourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialCreditSourcesService],
    }).compile();

    service = module.get<FinancialCreditSourcesService>(FinancialCreditSourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
