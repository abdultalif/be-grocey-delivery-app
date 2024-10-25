import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Products]), JwtModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [],
})
export class ProductsModule {}
