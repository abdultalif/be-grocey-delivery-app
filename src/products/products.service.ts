import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidationService } from 'src/common/validation.service';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from './products.dto';
import { ProductsValidation } from './products.validation';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { imagekit } from 'src/common/imagekit.config';

@Injectable()
export class ProductsService {
  constructor(
    private validationService: ValidationService,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async create(
    request: CreateProductRequest,
    file: Express.Multer.File,
  ): Promise<ProductResponse> {
    const createProduct = this.validationService.validate(
      ProductsValidation.CREATE,
      request,
    );

    const uploadImage = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: '/products',
    });

    const product = this.productsRepository.create({
      ...createProduct,
      image: uploadImage.url,
      image_public_id: uploadImage.fileId,
    });

    const result = await this.productsRepository.save(product);

    const savedProduct = Array.isArray(result) ? result[0] : result;

    return {
      id: savedProduct.id,
      name: savedProduct.name,
      price: savedProduct.price,
      stock: savedProduct.stock,
      image: savedProduct.image,
      image_public_id: savedProduct.image_public_id,
      description: savedProduct.description,
    };
  }

  async update(
    productId: string,
    request: UpdateProductRequest,
    file: Express.Multer.File,
  ): Promise<ProductResponse> {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    const updateProduct = this.validationService.validate(
      ProductsValidation.UPDATE,
      request,
    );

    let uploadImage;
    if (file) {
      if (product.image_public_id) {
        await imagekit.deleteFile(product.image_public_id);
      }

      uploadImage = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: '/products',
      });
      product.image = uploadImage.url;
      product.image_public_id = uploadImage.fileId;
    }

    product.name = updateProduct.name;
    product.price = updateProduct.price;
    product.stock = updateProduct.stock;
    product.description = updateProduct.description;

    const updatedProduct = await this.productsRepository.save(product);
    console.log(file);

    return {
      id: updatedProduct.id,
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      image: updatedProduct.image,
      image_public_id: updatedProduct.image_public_id,
      description: updatedProduct.description,
    };
  }

  async getAll(): Promise<ProductResponse[]> {
    const result = await this.productsRepository.find();

    if (result.length === 0) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    return result.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
      image_public_id: product.image_public_id,
      description: product.description,
    }));
  }
  async getById(productId: string): Promise<ProductResponse> {
    const result = await this.productsRepository.findOneBy({ id: productId });

    if (!result) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    return {
      id: productId,
      name: result.name,
      price: result.price,
      stock: result.stock,
      image: result.image,
      image_public_id: result.image_public_id,
      description: result.description,
    };
  }

  async remove(id: string): Promise<ProductResponse> {
    let user = await this.productsRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    await imagekit.deleteFile(user.image_public_id);
    user = await this.productsRepository.remove(user);

    return {
      id: id,
      name: user.name,
      price: user.price,
      stock: user.stock,
      image: user.image,
      image_public_id: user.image_public_id,
      description: user.description,
    };
  }
}
