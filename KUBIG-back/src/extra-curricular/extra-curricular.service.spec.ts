import { Test, TestingModule } from '@nestjs/testing';
import { ExtraCurricularService } from './extra-curricular.service';

describe('ExtraCurricularService', () => {
  let service: ExtraCurricularService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtraCurricularService],
    }).compile();

    service = module.get<ExtraCurricularService>(ExtraCurricularService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
