import { Test, TestingModule } from '@nestjs/testing';
import { ForKubigService } from './for-kubig.service';

describe('ForKubigService', () => {
  let service: ForKubigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForKubigService],
    }).compile();

    service = module.get<ForKubigService>(ForKubigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
