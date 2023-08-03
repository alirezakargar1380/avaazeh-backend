import { Test, TestingModule } from '@nestjs/testing';
import { ContractRateBasicsController } from './contract_rate_basics.controller';

describe('ContractRateBasicsController', () => {
  let controller: ContractRateBasicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractRateBasicsController],
    }).compile();

    controller = module.get<ContractRateBasicsController>(ContractRateBasicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
