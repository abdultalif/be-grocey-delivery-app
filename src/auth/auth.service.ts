import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ValidationService } from 'src/common/validation.service';
import {
  JwtPayload,
  LoginResponse,
  LoginUserRequest,
  RegisterResponse,
  RegisterUserRequest,
} from './auth.dto';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private authRepository: Repository<Users>,
    private validationService: ValidationService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(request: RegisterUserRequest): Promise<RegisterResponse> {
    const registerRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );

    const emailExists = await this.authRepository.findOne({
      where: { email: registerRequest.email },
    });

    if (emailExists) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = this.authRepository.create({
      email: registerRequest.email,
      name: registerRequest.name,
      password: registerRequest.password,
    });

    const result = await this.authRepository.save(user);

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role,
      is_verified: result.is_verified,
    };
  }

  async login(request: LoginUserRequest): Promise<LoginResponse> {
    const loginRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    const user = await this.authRepository.findOne({
      where: { email: loginRequest.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    if (!user.is_verified) {
      throw new ForbiddenException('Akun Anda belum diverifikasi.');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_verified: user.is_verified,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    return {
      token: token,
    };
  }
}
