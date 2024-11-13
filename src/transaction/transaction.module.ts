import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction_Details } from './entity/transaction_details.entity';
import { CommonModule } from 'src/common/common.module';
import { Products } from 'src/products/products.entity';
import { Carts } from 'src/carts/carts.entity';
import { Transaction } from './entity/transaction.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      Transaction,
      Transaction_Details,
      Products,
      Carts,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
