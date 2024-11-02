import { Test, TestingModule } from '@nestjs/testing';
import { RajaOngkirController } from './raja-ongkir.controller';

describe('RajaOngkirController', () => {
  let controller: RajaOngkirController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RajaOngkirController],
    }).compile();

    controller = module.get<RajaOngkirController>(RajaOngkirController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
