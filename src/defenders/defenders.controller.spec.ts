import { Test, TestingModule } from '@nestjs/testing';
import { DefendersController } from './defenders.controller';
import { DefendersService } from './defenders.service';

describe('DefendersController', () => {
  let controller: DefendersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefendersController],
      providers: [DefendersService],
    }).compile();

    controller = module.get<DefendersController>(DefendersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
