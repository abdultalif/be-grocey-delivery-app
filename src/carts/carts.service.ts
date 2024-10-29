import { Injectable, NotFoundException } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { CartResponse, CreateCartRequest, UpdateCartRequest } from './cart.dto';
import { ValidationService } from 'src/common/services/validation.service';
import { CartsValidation } from './validation/carts.validation';
import { Carts } from './carts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from 'src/products/products.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Carts)
    private cartsRepository: Repository<Carts>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private validationService: ValidationService,
  ) {}
  async create(user: Users, request: CreateCartRequest): Promise<CartResponse> {
    const requestData = this.validationService.validate(
      CartsValidation.CREATE,
      request,
    );

    const isProductExist = await this.productsRepository.findOne({
      where: { id: requestData.product_id },
    });

    if (!isProductExist) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    let existingCart = await this.cartsRepository.findOne({
      where: { user: { id: user.id }, product: { id: requestData.product_id } },
    });

    if (existingCart) {
      const quantity = existingCart.quantity + requestData.quantity;
      const total = existingCart.total + requestData.total;

      await this.cartsRepository.update(existingCart.id, {
        quantity,
        total,
      });

      existingCart = await this.cartsRepository.findOne({
        where: { id: existingCart.id },
      });
    } else {
      existingCart = await this.cartsRepository.save({
        quantity: requestData.quantity,
        total: requestData.total,
        user: { id: user.id },
        product: { id: requestData.product_id },
      });
    }

    return {
      id: existingCart.id,
      product_id: existingCart.product?.id,
      quantity: existingCart.quantity,
      total: existingCart.total,
      user_id: user.id,
    };
  }

  async getAll(user: Users): Promise<any> {
    const result = await this.cartsRepository.find({
      where: {
        user: { id: user.id },
      },
      relations: ['product', 'user'],
      select: {
        id: true,
        quantity: true,
        total: true,
        product: {
          id: true,
          name: true,
          price: true,
          stock: true,
          image: true,
          description: true,
        },
        user: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    });

    return result.map((cart) => ({
      id: cart.id,
      product: cart.product,
      quantity: cart.quantity,
      total: cart.total,
      user: cart.user,
    }));
  }

  async getById(user: Users, cartId: string): Promise<any> {
    const result = await this.cartsRepository.findOne({
      where: {
        id: cartId,
        user: { id: user.id },
      },
      relations: ['product', 'user'],
      select: {
        id: true,
        quantity: true,
        total: true,
        product: {
          id: true,
          name: true,
          price: true,
          stock: true,
          image: true,
          description: true,
        },
        user: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Data keranjang tidak ditemukan');
    }

    return {
      id: result.id,
      quantity: result.quantity,
      total: result.total,
      product: result.product,
      user: result.user,
    };
  }
  async deleteById(user: Users, cartId: string): Promise<CartResponse> {
    const cartExist = await this.cartsRepository.findOne({
      where: {
        id: cartId,
        user: { id: user.id },
      },
      relations: ['product', 'user'],
    });

    if (!cartExist) {
      throw new NotFoundException('Data keranjang tidak ditemukan');
    }

    const result = {
      id: cartExist.id,
      quantity: cartExist.quantity,
      total: cartExist.total,
      product_id: cartExist.product.id,
      user_id: user.id,
    };

    await this.cartsRepository.delete({ id: cartId });

    return result;
  }
  async deleteAll(user: Users): Promise<CartResponse[]> {
    const cartExist = await this.cartsRepository.find({
      where: {
        user: { id: user.id },
      },
      relations: ['product', 'user'],
    });

    if (cartExist.length === 0) {
      throw new NotFoundException('Data keranjang kosong');
    }

    const result = cartExist.map((cart) => ({
      id: cart.id,
      quantity: cart.quantity,
      total: cart.total,
      product_id: cart.product.id,
      user_id: user.id,
    }));

    await this.cartsRepository.delete({ user: { id: user.id } });

    return result;
  }

  async patch(
    user: Users,
    cartId: string,
    request: UpdateCartRequest,
  ): Promise<any> {
    const cart = await this.cartsRepository.findOne({
      where: {
        id: cartId,
        user: { id: user.id },
      },
      relations: ['product', 'user'],
    });

    if (!cart) {
      throw new NotFoundException('Data keranjang tidak ditemukan');
    }

    const requestData = this.validationService.validate(
      CartsValidation.UPDATE,
      request,
    );

    cart.quantity = requestData.quantity;
    cart.total = requestData.total;

    const result = await this.cartsRepository.save(cart);

    return {
      id: result.id,
      quantity: result.quantity,
      total: result.total,
      product: result.product,
      user: result.user,
    };
  }
}
