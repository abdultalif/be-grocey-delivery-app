import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RajaOngkirService } from './raja-ongkir.service';
import { WebResponse } from 'src/common/types/web-response.type';
import { costRequest, ProvincesResponse } from './raja-ongkir.dto';

@Controller('/api/v1/raja-ongkir')
export class RajaOngkirController {
  constructor(private rajaOngkirService: RajaOngkirService) {}

  @Get('/provinces')
  @HttpCode(HttpStatus.OK)
  async getProvinces(): Promise<WebResponse<ProvincesResponse[]>> {
    const result = await this.rajaOngkirService.getProvinces();

    return {
      statusCode: HttpStatus.OK,
      message: 'Data Provinsi Berhasil ditampilkan',
      data: result,
    };
  }
  @Get('/cities/:provinceId')
  @HttpCode(HttpStatus.OK)
  async getCitiesByProvince(
    @Param('provinceId', ParseIntPipe) provinceId: number,
  ): Promise<WebResponse<ProvincesResponse[]>> {
    const result = await this.rajaOngkirService.getCitiesByProvince(provinceId);
    let province;
    result.forEach((city) => {
      province = city.province.name;
    });

    return {
      statusCode: HttpStatus.OK,
      message: `Data kota dan kabupaten dari provinsi: ${province} Berhasil ditampilkan`,
      data: result,
    };
  }
  @Post('/cost')
  @HttpCode(HttpStatus.CREATED)
  async cost(@Body() request: costRequest): Promise<WebResponse<any>> {
    const result = await this.rajaOngkirService.cost(request);

    return {
      statusCode: HttpStatus.OK,
      message: `Cost Berhasil ditampilkan`,
      data: result,
    };
  }
}
