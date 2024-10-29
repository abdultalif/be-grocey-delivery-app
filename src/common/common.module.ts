import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationService } from './services/validation.service';
import { Users } from 'src/users/users.entity';
import { Products } from 'src/products/products.entity';
import { JwtModule } from '@nestjs/jwt';
import { Carts } from 'src/carts/carts.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Users, Products, Carts],
        synchronize: false,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
    }),
    JwtModule,
  ],
  providers: [ValidationService],
  exports: [ValidationService],
})
export class CommonModule {}
