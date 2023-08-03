import { Test, TestingModule } from '@nestjs/testing';
import { RoleAccService } from './role-acc.service';

describe('RoleAccService', () => {
  let service: RoleAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAccService],
    }).compile();

    service = module.get<RoleAccService>(RoleAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
