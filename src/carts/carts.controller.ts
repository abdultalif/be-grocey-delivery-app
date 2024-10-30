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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Users } from 'src/users/users.entity';
import { CartResponse, CreateCartRequest, UpdateCartRequest } from './cart.dto';
import { WebResponse } from 'src/common/types/web-response.type';
import { CartsService } from './carts.service';

@Controller('/api/v1/carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Auth() user: Users,
    @Body() request: CreateCartRequest,
  ): Promise<WebResponse<CartResponse>> {
    const result = await this.cartsService.create(user, request);

    return {
      message: 'berhasil menambah data keranjang',
      statusCode: HttpStatus.CREATED,
      data: result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(HttpStatus.OK)
  async getAll(@Auth() user: Users): Promise<WebResponse<any>> {
    const result = await this.cartsService.getAll(user);

    return {
      message: 'Data keranjang berhasil diambil',
      statusCode: HttpStatus.OK,
      data: result.map((cart) => ({
        id: cart.id,
        quantity: cart.quantity,
        total: cart.total,
        product: cart.product,
        user: cart.user,
      })),
    };
  }

  @Get('/:cartId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Auth() user: Users,
    @Param('cartId', ParseUUIDPipe) cartId: string,
  ): Promise<WebResponse<any>> {
    const result = await this.cartsService.getById(user, cartId);

    return {
      message: `Data keranjang id: ${cartId} berhasil diambil`,
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Delete('/:cartId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(HttpStatus.OK)
  async deleteById(
    @Auth() user: Users,
    @Param('cartId', ParseUUIDPipe) cartId: string,
  ): Promise<WebResponse<CartResponse>> {
    const result = await this.cartsService.deleteById(user, cartId);

    return {
      message: `Data keranjang id: ${cartId} berhasil dihapus`,
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(HttpStatus.OK)
  async deleteAll(@Auth() user: Users): Promise<WebResponse<CartResponse[]>> {
    const result = await this.cartsService.deleteAll(user);

    return {
      message: 'Data keranjang berhasil dihapus',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Patch('/:cartId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(HttpStatus.OK)
  async patch(
    @Auth() user: Users,
    @Param('cartId', ParseUUIDPipe) cartId: string,
    @Body() request: UpdateCartRequest,
  ): Promise<WebResponse<any>> {
    const result = await this.cartsService.patch(user, cartId, request);

    return {
      message: `Data keranajang ID: ${cartId} berhasil diupdate`,
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
