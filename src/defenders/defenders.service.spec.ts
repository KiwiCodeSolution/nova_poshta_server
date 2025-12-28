import { Test, TestingModule } from '@nestjs/testing';
import { DefendersService } from './defenders.service';

describe('DefendersService', () => {
  let service: DefendersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefendersService],
    }).compile();

    service = module.get<DefendersService>(DefendersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
