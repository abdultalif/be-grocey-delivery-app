import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import bcrypt from 'bcrypt';
import { ValidationService } from 'src/common/services/validation.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginUserRequest, RegisterUserRequest } from '../auth.dto';
import { AuthService } from '../auth.service';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: Repository<Users>;
  let validationService: ValidationService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
        {
          provide: ValidationService,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('1h'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    validationService = module.get<ValidationService>(ValidationService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    const responseData: Users = {
      id: '1',
      email: 'abdultalif@gmail.com',
      name: 'Abdul Talif',
      role: 'User',
      is_verified: false,
      address: null,
      image: 'https://ik.imagekit.io/abdullt85/users/default.jpg',
      phone: null,
      password: 'hashedPassword',
      created_at: new Date(),
      updated_at: new Date(),
      carts: [],
      reviews: [],
      transactions: [],
    };
    const requestData: RegisterUserRequest = {
      email: 'abdultalif@gmail.com',
      name: 'Abdul Talif',
      password: 'talif123',
      confirmPassword: 'talif123',
    };
    it('should success register', async () => {
      jest.spyOn(validationService, 'validate').mockReturnValue(requestData);
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(requestData.password);
      jest.spyOn(authRepository, 'create').mockReturnValue(responseData);
      jest.spyOn(authRepository, 'save').mockResolvedValue(responseData);

      const result = await service.register(requestData);

      expect(result).toEqual({
        id: '1',
        email: 'abdultalif@gmail.com',
        name: 'Abdul Talif',
        role: 'User',
        image: 'https://ik.imagekit.io/abdullt85/users/default.jpg',
        is_verified: false,
      });
    });

    it('should bad request register', async () => {
      jest.spyOn(validationService, 'validate').mockReturnValue(requestData);
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(responseData);

      await expect(service.register(requestData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Login', () => {
    const requestData: LoginUserRequest = {
      email: 'abdultalif@gmail.com',
      password: 'talif123',
    };

    it('should login success', async () => {
      const user: Users = {
        id: '1',
        email: 'abdultalif@gmail.com',
        name: 'Abdul Talif',
        role: 'User',
        is_verified: true,
        address: null,
        phone: null,
        image: 'https://ik.imagekit.io/abdullt85/users/default.jpg',
        password: await bcrypt.hash('talif123', 10),
        created_at: new Date(),
        updated_at: new Date(),
        carts: [],
        reviews: [],
        transactions: [],
      };
      const token = 'jwt-token';

      jest.spyOn(validationService, 'validate').mockReturnValue(requestData);
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const response = await service.login(requestData);

      expect(response).toEqual({ token });
    });
    it('should unauthorized login because email wrong', async () => {
      jest.spyOn(validationService, 'validate').mockReturnValue(requestData);
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(null);
      await expect(service.login(requestData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should unauthorized login because password wrong', async () => {
      const user: Users = {
        id: '1',
        email: 'abdultalif@gmail.com',
        name: 'Abdul Talif',
        role: 'User',
        is_verified: true,
        address: null,
        image: 'https://ik.imagekit.io/abdullt85/users/default.jpg',
        phone: null,
        password: await bcrypt.hash('talif123', 10),
        created_at: new Date(),
        updated_at: new Date(),
        carts: [],
        reviews: [],
        transactions: [],
      };
      jest.spyOn(validationService, 'validate').mockReturnValue(requestData);
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      await expect(service.login(requestData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should forbbiden login because is_verified false', async () => {
      const user: Users = {
        id: '1',
        email: 'abdultalif@gmail.com',
        name: 'Abdul Talif',
        role: 'User',
        is_verified: false,
        image: 'https://ik.imagekit.io/abdullt85/users/default.jpg',
        address: null,
        phone: null,
        password: await bcrypt.hash('talif123', 10),
        created_at: new Date(),
        updated_at: new Date(),
        carts: [],
        reviews: [],
        transactions: [],
      };
      jest.spyOn(validationService, 'validate').mockReturnValue(requestData);
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      await expect(service.login(requestData)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
