import { Test, TestingModule } from '@nestjs/testing';
import { AuthCodeService } from './auth_code.service';

describe('AuthCodeService', () => {
  let service: AuthCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthCodeService],
    }).compile();

    service = module.get<AuthCodeService>(AuthCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
