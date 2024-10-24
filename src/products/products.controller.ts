import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductRequest, CreateProductResponse } from './products.dto';
import { WebResponse } from 'src/common/web-response.type';
import { Auth } from 'src/common/auth.decorator';
import { Users } from 'src/users/users.entity';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('/api/v1/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  @HttpCode(201)
  async create(
    @Auth() user: Users,
    @Body() request: CreateProductRequest,
  ): Promise<WebResponse<CreateProductResponse>> {
    const result = await this.productsService.create(request);
    return {
      message: 'Products created successfully',
      statusCode: 201,
      data: result,
    };
  }
}
