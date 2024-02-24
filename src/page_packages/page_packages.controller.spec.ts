import { Test, TestingModule } from '@nestjs/testing';
import { PagePackagesController } from './page_packages.controller';

describe('PagePackagesController', () => {
  let controller: PagePackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagePackagesController],
    }).compile();

    controller = module.get<PagePackagesController>(PagePackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
