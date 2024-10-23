import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation.service';
import { RegisterResponse, RegisterUserRequest } from './auth.dto';
import { AuthValidation } from './auth.validation';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    private usersService: UsersService,
  ) {}

  async register(request: RegisterUserRequest): Promise<RegisterResponse> {
    const registerRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );

    const emailExists = await this.usersService.findByEmail(
      registerRequest.email,
    );

    if (emailExists) {
      throw new BadRequestException('Email Already Exist');
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.usersService.createUser({
      email: registerRequest.email,
      name: registerRequest.name,
      password: registerRequest.password,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_verified: user.is_verified,
    };
  }
}
