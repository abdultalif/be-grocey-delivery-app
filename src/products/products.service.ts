import { Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation.service';
import { CreateProductRequest, CreateProductResponse } from './products.dto';
import { ProductsValidation } from './products.validation';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    private validationService: ValidationService,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async create(request: CreateProductRequest): Promise<CreateProductResponse> {
    const createProduct = this.validationService.validate(
      ProductsValidation.CREATE,
      request,
    );

    createProduct.image_public_id = 'Talif';

    const product = this.productsRepository.create(createProduct);

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
}
