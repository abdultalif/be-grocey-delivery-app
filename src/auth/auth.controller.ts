import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterResponse, RegisterUserRequest } from './auth.dto';
import { WebResponse } from 'src/common/web-response.type';

@Controller('/api/v1/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(201)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<RegisterResponse>> {
    const result: RegisterResponse = await this.authService.register(request);
    return {
      message: 'User created successfully',
      statusCode: 201,
      data: result,
    };
  }
}
