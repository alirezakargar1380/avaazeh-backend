import { Test, TestingModule } from '@nestjs/testing';
import { ReportStatusService } from './report_status.service';

describe('ReportStatusService', () => {
  let service: ReportStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportStatusService],
    }).compile();

    service = module.get<ReportStatusService>(ReportStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
