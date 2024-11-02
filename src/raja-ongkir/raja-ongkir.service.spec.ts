import { Test, TestingModule } from '@nestjs/testing';
import { RajaOngkirService } from './raja-ongkir.service';

describe('RajaOngkirService', () => {
  let service: RajaOngkirService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RajaOngkirService],
    }).compile();

    service = module.get<RajaOngkirService>(RajaOngkirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
