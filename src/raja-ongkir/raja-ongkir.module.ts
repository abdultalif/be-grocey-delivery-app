import { Module } from '@nestjs/common';
import { RajaOngkirController } from './raja-ongkir.controller';
import { RajaOngkirService } from './raja-ongkir.service';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from './entity/citites.entity';
import { Provinces } from './entity/provinces.entity';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Cities, Provinces])],
  controllers: [RajaOngkirController],
  providers: [RajaOngkirService],
})
export class RajaOngkirModule {}
