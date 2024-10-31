import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carts } from './carts.entity';
import { CommonModule } from 'src/common/common.module';
import { Products } from 'src/products/products.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Carts, Products]),
    AuthModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
