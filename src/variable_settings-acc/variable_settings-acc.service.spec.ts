import { Test, TestingModule } from '@nestjs/testing';
import { VariableSettingsAccService } from './variable_settings-acc.service';

describe('VariableSettingsAccService', () => {
  let service: VariableSettingsAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariableSettingsAccService],
    }).compile();

    service = module.get<VariableSettingsAccService>(VariableSettingsAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
