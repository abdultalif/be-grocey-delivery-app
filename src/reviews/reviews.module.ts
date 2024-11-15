import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from './reviews.entity';
import { JwtModule } from '@nestjs/jwt';
import { Transaction } from 'src/transaction/entity/transaction.entity';
import { Transaction_Details } from 'src/transaction/entity/transaction_details.entity';
import { Products } from 'src/products/products.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      Reviews,
      Transaction,
      Transaction_Details,
      Products,
    ]),
    JwtModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
