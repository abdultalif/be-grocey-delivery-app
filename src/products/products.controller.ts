import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { WebResponse } from 'src/common/types/web-response.type';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() request: CreateProductRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productsService.create(request, file);
    return {
      message: 'Products created successfully',
      statusCode: HttpStatus.CREATED,
      data: result,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll(): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productsService.getAll();
    return {
      message: 'Data produk berhasil diambil',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:category')
  async getByCategory(
    @Param('category') category: string,
  ): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productsService.getByCategory(category);
    return {
      message: `Data produk katregori: ${category} berhasil diambil`,
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @HttpCode(HttpStatus.OK)
  @Get('/:productId')
  async getById(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productsService.getById(productId);
    return {
      message: 'Data produk berhasil diambil',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @HttpCode(HttpStatus.OK)
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
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @HttpCode(HttpStatus.OK)
  @Delete('/:productId')
  async delete(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productsService.remove(productId);
    return {
      message: 'Produk dihapus',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
