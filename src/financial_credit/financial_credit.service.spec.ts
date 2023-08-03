import { Test, TestingModule } from '@nestjs/testing';
import { FinancialCreditService } from './financial_credit.service';

describe('FinancialCreditService', () => {
  let service: FinancialCreditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialCreditService],
    }).compile();

    service = module.get<FinancialCreditService>(FinancialCreditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
