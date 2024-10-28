import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {
  LoginUserRequest,
  RegisterResponse,
  RegisterUserRequest,
} from '../auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const request: RegisterUserRequest = {
        email: 'abdultalif@gmail.com',
        name: 'Abdul Talif',
        password: 'talif123',
        confirmPassword: 'talif123',
      };

      const response: RegisterResponse = {
        id: '1',
        email: request.email,
        name: request.name,
        role: 'User',
        is_verified: false,
      };
      jest.spyOn(authService, 'register').mockResolvedValue(response);

      const result = await authController.register(request);

      expect(result).toEqual({
        message: 'Registrasi berhasil',
        statusCode: 201,
        data: response,
      });
      expect(authService.register).toHaveBeenCalledWith(request);
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const request: LoginUserRequest = {
        email: 'abdultalif@gmail.com',
        password: 'talif123',
      };
      const response = { token: 'jwt_token' };

      jest.spyOn(authService, 'login').mockResolvedValue(response);

      const result = await authController.login(request);

      expect(authService.login).toHaveBeenCalledWith(request);
      expect(result).toEqual({
        message: 'Login berhasil',
        statusCode: 200,
        data: response,
      });
    });
  });
});
