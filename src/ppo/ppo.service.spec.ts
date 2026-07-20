import { Test, TestingModule } from '@nestjs/testing';
import { PpoService } from './ppo.service';

describe('PpoService', () => {
  let service: PpoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PpoService],
    }).compile();

    service = module.get<PpoService>(PpoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
