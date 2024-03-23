import { Test, TestingModule } from '@nestjs/testing';
import { RecruitingController } from './recruiting.controller';

describe('RecruitingController', () => {
  let controller: RecruitingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruitingController],
    }).compile();

    controller = module.get<RecruitingController>(RecruitingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
