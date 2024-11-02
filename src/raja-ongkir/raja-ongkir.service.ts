import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Provinces } from './entity/provinces.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from './entity/citites.entity';
import { ConfigService } from '@nestjs/config';
import {
  CitiesResponse,
  costRequest,
  ProvincesResponse,
} from './raja-ongkir.dto';
import axios from 'axios';

@Injectable()
export class RajaOngkirService {
  constructor(
    @InjectRepository(Provinces)
    private provincesRepository: Repository<Provinces>,
    @InjectRepository(Cities)
    private citiesRepository: Repository<Cities>,
    private configService: ConfigService,
  ) {}

  async getProvinces(): Promise<ProvincesResponse[]> {
    const result = await this.provincesRepository.find();

    if (result.length === 0)
      throw new NotFoundException('Data Provinsi Tidak Ditemukan');

    return result.map((province) => ({
      id: province.id.toString(),
      name: province.name,
    }));
  }
  async getCitiesByProvince(provinceId: number): Promise<CitiesResponse[]> {
    const result = await this.citiesRepository.find({
      where: {
        province: { id: provinceId },
      },
      relations: ['province'],
      select: {
        id: true,
        name: true,
        type: true,
        postal_code: true,
        province: {
          id: true,
          name: true,
        },
      },
    });

    if (result.length === 0)
      throw new NotFoundException('Data Kota/Kabupaten Tidak Ditemukan');

    return result.map((cities) => ({
      id: cities.id.toString(),
      name: cities.name,
      type: cities.type,
      postal_code: cities.postal_code,
      province: {
        id: cities.province.id.toString(),
        name: cities.province.name,
      },
    }));
  }

  async cost(request: costRequest): Promise<any> {
    const response = await axios.post(
      'https://api.rajaongkir.com/starter/cost',
      {
        origin: 79,
        destination: request.destination,
        weight: request.weight,
        courier: request.courier,
      },
      {
        headers: {
          key: this.configService.get<string>('RAJA_ONGKIR_KEY'),
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data.rajaongkir.results;
  }
}
