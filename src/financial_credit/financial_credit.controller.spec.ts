import { Test, TestingModule } from '@nestjs/testing';
import { FinancialCreditController } from './financial_credit.controller';

describe('FinancialCreditController', () => {
  let controller: FinancialCreditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialCreditController],
    }).compile();

    controller = module.get<FinancialCreditController>(FinancialCreditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
