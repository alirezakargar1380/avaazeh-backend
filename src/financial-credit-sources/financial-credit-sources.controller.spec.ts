import { Test, TestingModule } from '@nestjs/testing';
import { FinancialCreditSourcesController } from './financial-credit-sources.controller';

describe('FinancialCreditSourcesController', () => {
  let controller: FinancialCreditSourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialCreditSourcesController],
    }).compile();

    controller = module.get<FinancialCreditSourcesController>(FinancialCreditSourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
