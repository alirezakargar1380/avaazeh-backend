import { Test, TestingModule } from '@nestjs/testing';
import { LogsAccService } from './logs-acc.service';

describe('LogsAccService', () => {
  let service: LogsAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsAccService],
    }).compile();

    service = module.get<LogsAccService>(LogsAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
