import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginResponse,
  LoginUserRequest,
  RegisterResponse,
  RegisterUserRequest,
} from './auth.dto';
import { WebResponse } from 'src/common/web-response.type';
import { Auth } from 'src/common/auth.decorator';
import { Users } from 'src/users/users.entity';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { JwtAuthGuard } from './auth.guard';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(201)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<RegisterResponse>> {
    const result: RegisterResponse = await this.authService.register(request);
    return {
      message: 'Registrasi berhasil',
      statusCode: 201,
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<LoginResponse>> {
    const result: LoginResponse = await this.authService.login(request);
    return {
      message: 'Login berhasil',
      statusCode: 200,
      data: result,
    };
  }

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async current(@Auth() user: Users): Promise<WebResponse<any>> {
    return {
      message: 'Data pengguna berhasil diambil',
      statusCode: 200,
      data: user,
    };
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @HttpCode(200)
  async getAdminData(@Auth() user: Users): Promise<WebResponse<any>> {
    return {
      message: 'Data admin berhasil diambil',
      statusCode: 200,
      data: user,
    };
  }
}
