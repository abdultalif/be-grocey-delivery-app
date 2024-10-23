import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Users } from 'src/users/users.entity';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ValidationService } from 'src/common/validation.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UsersModule, JwtModule],
  providers: [AuthService, ValidationService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
