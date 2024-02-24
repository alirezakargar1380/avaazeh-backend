import { Test, TestingModule } from '@nestjs/testing';
import { PagePackagesService } from './page_packages.service';

describe('PagePackagesService', () => {
  let service: PagePackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagePackagesService],
    }).compile();

    service = module.get<PagePackagesService>(PagePackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
