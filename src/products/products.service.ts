import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidationService } from 'src/common/services/validation.service';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from './products.dto';
import { ProductsValidation } from './validation/products.validation';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { imagekit } from 'src/common/config/imagekit.config';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class ProductsService {
  constructor(
    private validationService: ValidationService,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private redisService: RedisService,
  ) {}

  private async clearCache() {
    await this.redisService.del('all_products');
    await this.redisService.del('all_products_with_reviews');
    await this.redisService.del('all_products_with_reviews_by_category');
  }

  async create(
    request: CreateProductRequest,
    file: Express.Multer.File,
  ): Promise<ProductResponse> {
    const createProduct = this.validationService.validate(
      ProductsValidation.CREATE,
      request,
    );

    const productExist = await this.productsRepository.findOneBy({
      name: createProduct.name,
    });

    if (productExist) {
      throw new NotFoundException('Produk sudah ada');
    }

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

    await this.clearCache();

    return {
      id: savedProduct.id,
      name: savedProduct.name,
      category: savedProduct.category,
      weight: savedProduct.weight,
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

    await this.clearCache();

    return {
      id: updatedProduct.id,
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      category: updatedProduct.category,
      weight: updatedProduct.weight,
      image: updatedProduct.image,
      image_public_id: updatedProduct.image_public_id,
      description: updatedProduct.description,
    };
  }

  async getAll(): Promise<ProductResponse[]> {
    const cachedProducts = await this.redisService.get('all_products');
    if (cachedProducts) {
      console.log('Fetching products from redis cache');
      return JSON.parse(cachedProducts);
    }

    const result = await this.productsRepository.find();

    if (result.length === 0) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    await this.redisService.set('all_products', JSON.stringify(result), 3600);
    console.log('Fetching products from DB');

    return result.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      weight: product.weight,
      image: product.image,
      image_public_id: product.image_public_id,
      description: product.description,
    }));
  }

  async getAllWithReviews(): Promise<any> {
    const cachedProducts = await this.redisService.get(
      'all_products_with_reviews',
    );
    if (cachedProducts) {
      console.log('Fetching products with reviews from redis cache');
      return JSON.parse(cachedProducts);
    }

    const result = await this.productsRepository.find({
      relations: ['reviews'],
    });

    if (result.length === 0) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    const productsWithReviews = result.map((product) => {
      const reviewCount = product.reviews.length;
      const averageRating =
        reviewCount > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviewCount
          : 0;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        weight: product.weight,
        image: product.image,
        image_public_id: product.image_public_id,
        description: product.description,
        averageRating: parseFloat(averageRating.toFixed(2)),
        reviewCount,
      };
    });

    await this.redisService.set(
      'all_products_with_reviews',
      JSON.stringify(result),
      3600,
    );

    console.log('Fetching products with reviews from DB');

    return productsWithReviews;
  }

  async getByCategory(category: string): Promise<ProductResponse[]> {
    const cachedProducts = await this.redisService.get(
      'all_products_with_reviews_by_category',
    );

    if (cachedProducts) {
      console.log(
        'Fetching products with reviews by category from redis cache',
      );
      return JSON.parse(cachedProducts);
    }

    const result = await this.productsRepository.find({
      where: { category: category },
      relations: ['reviews'],
    });

    if (result.length === 0) {
      throw new NotFoundException(
        `Produk katregori ${category} tidak ditemukan`,
      );
    }

    const productsWithReviewsByCategory = result.map((product) => {
      const reviewCount = product.reviews.length;
      const averageRating =
        reviewCount > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviewCount
          : 0;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        weight: product.weight,
        image: product.image,
        image_public_id: product.image_public_id,
        description: product.description,
        averageRating: parseFloat(averageRating.toFixed(2)),
        reviewCount,
      };
    });
    await this.redisService.set(
      'all_products_with_reviews_by_category',
      JSON.stringify(result),
      3600,
    );

    console.log('Fetching products with reviews by category from DB');
    return productsWithReviewsByCategory;
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
      category: result.category,
      weight: result.weight,
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

    await this.clearCache();

    return {
      id: id,
      name: user.name,
      price: user.price,
      stock: user.stock,
      category: user.category,
      weight: user.weight,
      image: user.image,
      image_public_id: user.image_public_id,
      description: user.description,
    };
  }
}
