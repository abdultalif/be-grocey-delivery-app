import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carts } from './carts.entity';
import { CommonModule } from 'src/common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { Products } from 'src/products/products.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Carts, Products]),
    JwtModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
