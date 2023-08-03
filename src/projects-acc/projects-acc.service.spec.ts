import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsAccService } from './projects-acc.service';

describe('ProjectsAccService', () => {
  let service: ProjectsAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsAccService],
    }).compile();

    service = module.get<ProjectsAccService>(ProjectsAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
