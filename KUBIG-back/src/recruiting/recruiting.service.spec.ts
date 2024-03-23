import { Test, TestingModule } from '@nestjs/testing';
import { RecruitingService } from './recruiting.service';

describe('RecruitingService', () => {
  let service: RecruitingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruitingService],
    }).compile();

    service = module.get<RecruitingService>(RecruitingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
