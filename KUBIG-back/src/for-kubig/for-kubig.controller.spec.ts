import { Test, TestingModule } from '@nestjs/testing';
import { ForKubigController } from './for-kubig.controller';

describe('ForKubigController', () => {
  let controller: ForKubigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForKubigController],
    }).compile();

    controller = module.get<ForKubigController>(ForKubigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
