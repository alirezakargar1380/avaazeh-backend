import { Test, TestingModule } from '@nestjs/testing';
import { UsersAccService } from './users-acc.service';

describe('UsersAccService', () => {
  let service: UsersAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersAccService],
    }).compile();

    service = module.get<UsersAccService>(UsersAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
