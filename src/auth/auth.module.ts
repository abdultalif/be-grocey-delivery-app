import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Users } from 'src/users/users.entity';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ValidationService } from 'src/common/validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UsersModule],
  providers: [AuthService, ValidationService],
  controllers: [AuthController],
})
export class AuthModule {}
