import { Test, TestingModule } from '@nestjs/testing';
import { ReportsAccService } from './reports-acc.service';

describe('ReportsAccService', () => {
  let service: ReportsAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsAccService],
    }).compile();

    service = module.get<ReportsAccService>(ReportsAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
