import { Test, TestingModule } from '@nestjs/testing';
import { ExtraCurricularController } from './extra-curricular.controller';

describe('ExtraCurricularController', () => {
  let controller: ExtraCurricularController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtraCurricularController],
    }).compile();

    controller = module.get<ExtraCurricularController>(
      ExtraCurricularController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
