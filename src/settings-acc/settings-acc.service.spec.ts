import { Test, TestingModule } from '@nestjs/testing';
import { SettingsAccService } from './settings-acc.service';

describe('SettingsAccService', () => {
  let service: SettingsAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingsAccService],
    }).compile();

    service = module.get<SettingsAccService>(SettingsAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
