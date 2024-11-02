import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { RajaOngkirModule } from './raja-ongkir/raja-ongkir.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CartsModule,
    RajaOngkirModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
