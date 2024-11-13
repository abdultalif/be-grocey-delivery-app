import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import midtransClient from 'midtrans-client';
import { Products } from 'src/products/products.entity';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { v4 as order_id } from 'uuid';
import { Transaction } from './entity/transaction.entity';
import { Transaction_Details } from './entity/transaction_details.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Carts } from 'src/carts/carts.entity';
import crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class TransactionService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Transaction_Details)
    private transactionDetailsRepository: Repository<Transaction_Details>,
    @InjectRepository(Carts)
    private cartRepository: Repository<Carts>,
  ) {}

  async createTransaction(user: Users, request: any): Promise<any> {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: this.configService.get<string>('MIDTRANS_SERVER_KEY'),
    });

    const items = request.items;
    const parameter = {
      transaction_details: {
        order_id: order_id(),
        gross_amount: request.total,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.phone,
      },
      shipping_address: {
        first_name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      callbacks: {
        finish: `http://127.0.0.1:5143/(ini di isi endpoint dari frontend)`,
        error: `http://127.0.0.1:5143/(ini di isi endpoint dari frontend)`,
        pending: `http://127.0.0.1:5143/(ini di isi endpoint dari frontend)`,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;

    const newTransaction = this.transactionsRepository.create({
      id: parameter.transaction_details.order_id,
      user: { id: user.id },
      total_price: request.total,
      shipping_price: request.shippingPrice,
      status_transaction: 'PENDING',
      token_midtrans: transactionToken,
      response_midtrans: JSON.stringify(transaction),
    });

    await this.transactionsRepository.save(newTransaction);

    const transactionItems = await Promise.all(
      items.map(async (item) => {
        const product = await this.productsRepository.findOne({
          where: { id: item.product_id },
        });

        if (!product) {
          throw new NotFoundException(
            `produk dengan id: ${item.product_id} tidak ditemukan`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stok untuk produk ${product.name} tidak mencukupi`,
          );
        }

        product.stock -= item.quantity;
        await this.productsRepository.save(product);

        return this.transactionDetailsRepository.create({
          product: product,
          transaction: newTransaction,
          quantity: item.quantity,
          sub_total: item.sub_total,
        });
      }),
    );

    await this.transactionDetailsRepository.save(transactionItems);
    await this.cartRepository.delete({ user: { id: user.id } });

    return {
      redirect_url: transaction.redirect_url,
      token: transactionToken,
    };
  }

  async webHookMidtrans(user: Users, request: any): Promise<any> {
    const midtransStatus = request.transaction_status;
    const transactionId = request.order_id;
    const statusCode = request.status_code;
    const grossAmount = request.gross_amount;
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');

    const dataString = transactionId + statusCode + grossAmount + serverKey;
    const SignatureKey = crypto
      .createHash('sha512')
      .update(dataString)
      .digest('hex');

    if (SignatureKey === request.signature_key) {
      const transaction = await this.transactionsRepository.findOne({
        where: { id: transactionId, user: { id: user.id } },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      switch (midtransStatus) {
        case 'pending':
        case 'deny':
          transaction.status_transaction = 'Pending';
          break;
        case 'capture':
        case 'settlement':
          transaction.status_transaction = 'Success';
          break;
        case 'cancel':
        case 'expire':
          transaction.status_transaction = 'Cancelled';
          break;
        case 'refund':
          transaction.status_transaction = 'Refunded';
          break;
        default:
          throw new BadRequestException('Invalid transaction status');
      }
      const response = await this.transactionsRepository.save(transaction);

      return response;
    } else {
      throw new BadRequestException('Invalid signature key');
    }
  }

  async cancelTransaction(user: Users, request: any): Promise<any> {
    const url = `https://api.sandbox.midtrans.com/v2/${request.transaction_id}/cancel`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        Buffer.from(
          this.configService.get<string>('MIDTRANS_SERVER_KEY') + ':',
        ).toString('base64'),
    };
    const data = {
      transaction_id: request.transaction_id,
    };

    const response = await axios.post(url, data, { headers });

    if (response.data.transaction_status == 'cancel') {
      await this.transactionsRepository.update(
        { id: request.transaction_id },
        { status_transaction: 'Cancelled' },
      );
    }

    return response.data;
  }
}
