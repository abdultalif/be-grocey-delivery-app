import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from './products.dto';
import { WebResponse } from 'src/common/web-response.type';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() request: CreateProductRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productsService.create(request, file);
    return {
      message: 'Products created successfully',
      statusCode: 201,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @Get('')
  async getAll(): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productsService.getAll();
    return {
      message: 'Data produk berhasil diambil',
      statusCode: 200,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @Get('/:productId')
  async getById(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productsService.getById(productId);
    return {
      message: 'Data produk berhasil diambil',
      statusCode: 200,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @Patch('/:productId')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() request: UpdateProductRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productsService.update(productId, request, file);
    return {
      message: 'Data produk berhasil diambil',
      statusCode: 200,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(200)
  @Delete('/:productId')
  async delete(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productsService.remove(productId);
    return {
      message: 'Produk dihapus',
      statusCode: 200,
      data: result,
    };
  }
}
