import { Test, TestingModule } from '@nestjs/testing';
import { PpoController } from './ppo.controller';

describe('PpoController', () => {
  let controller: PpoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PpoController],
    }).compile();

    controller = module.get<PpoController>(PpoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
