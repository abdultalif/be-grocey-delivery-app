import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reviews } from './reviews.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { RequestReviews } from './reviews.dto';
import { ValidationService } from 'src/common/services/validation.service';
import { ReviewsValidation } from './reviews.validation';
import { Transaction } from 'src/transaction/entity/transaction.entity';
import { Transaction_Details } from 'src/transaction/entity/transaction_details.entity';
import { Products } from 'src/products/products.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Transaction_Details)
    private transactionDetailsRepository: Repository<Transaction_Details>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private validationService: ValidationService,
  ) {}

  async createReview(user: Users, request: RequestReviews): Promise<any> {
    const requestData: RequestReviews = this.validationService.validate(
      ReviewsValidation.CREATE,
      request,
    );

    const transaction = await this.transactionsRepository.findOne({
      where: { id: requestData.transaction_id, user: { id: user.id } },
      relations: ['user'],
    });
    console.log(`transaksi: ${transaction}`);

    if (transaction.status_transaction !== 'Success') {
      throw new ForbiddenException(
        `Anda tidak bisa melakukan review karena status transaksi: ${transaction.status_transaction}`,
      );
    }

    const transactionDetail = await this.transactionDetailsRepository.findOne({
      where: {
        transaction: { id: requestData.transaction_id },
        product: { id: requestData.product_id },
      },
      relations: ['transaction', 'product'],
    });

    if (!transactionDetail) {
      throw new ForbiddenException(
        `Anda tidak bisa melakukan review karena produk: ${requestData.product_id} tidak ada di transaksi: ${requestData.transaction_id}`,
      );
    }

    const review = this.reviewsRepository.create({
      product: { id: requestData.product_id },
      transaction: { id: requestData.transaction_id },
      comment: requestData.comment,
      rating: requestData.rating,
      user: { id: user.id },
    });

    const existingReview = await this.reviewsRepository.findOne({
      where: {
        product: { id: requestData.product_id },
        transaction: { id: requestData.transaction_id },
        user: { id: user.id },
      },
    });

    if (existingReview) {
      throw new ForbiddenException(
        `Anda sudah melakukan review untuk produk: ${requestData.product_id} pada transaksi: ${requestData.transaction_id}`,
      );
    }

    const result = await this.reviewsRepository.save(review);

    return {
      id: result.id,
      product_id: result.product.id,
      transaction_id: result.transaction.id,
      comment: result.comment,
      rating: result.rating,
      user_id: result.user.id,
    };
  }

  async getReviewsByProduct(productId: string): Promise<any> {
    const result = await this.reviewsRepository.find({
      where: {
        product: { id: productId },
      },
      relations: ['product', 'transaction', 'user'],
      select: {
        id: true,
        rating: true,
        comment: true,
        product: {
          id: true,
          name: true,
          price: true,
          stock: true,
          category: true,
          weight: true,

          image: true,
          description: true,
        },
        user: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
        transaction: {
          id: true,
        },
      },
    });
    return result;
  }

  async getReviews(): Promise<any> {
    const result = await this.reviewsRepository.find({
      relations: ['product', 'transaction', 'user'],
      select: {
        id: true,
        rating: true,
        comment: true,
        product: {
          id: true,
          name: true,
          price: true,
          stock: true,
          category: true,
          weight: true,

          image: true,
          description: true,
        },
        user: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
        transaction: {
          id: true,
        },
      },
    });
    return result;
  }
}
