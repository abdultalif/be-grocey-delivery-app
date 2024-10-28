import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import request from 'supertest';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth - Register', () => {
    it('should register a user successfully', async () => {
      const registerData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
      };

      jest.spyOn(authService, 'register').mockImplementation(async () => ({
        id: '123',
        email: registerData.email,
        name: registerData.name,
        role: 'User',
        is_verified: true,
      }));

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth')
        .send(registerData)
        .expect(201);

      expect(response.body).toEqual({
        message: 'Registrasi berhasil',
        statusCode: 201,
        data: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'User',
          is_verified: true,
        },
      });
    });

    it('should throw error for duplicate email', async () => {
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new BadRequestException('Email sudah terdaftar'));

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth')
        .send({
          email: 'duplicate@example.com',
          name: 'Duplicate User',
          password: '123456',
          confirmPassword: '123456',
        })
        .expect(400);

      expect(response.body.message).toBe('Email sudah terdaftar');
    });
  });

  describe('POST /api/v1/auth/login - Login', () => {
    it('should login a user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'login').mockImplementation(async () => ({
        token: 'jwt-token',
      }));

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Login berhasil',
        statusCode: 200,
        data: {
          token: 'jwt-token',
        },
      });
    });

    it('should throw error for invalid credentials', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(
          new UnauthorizedException('Email atau password salah'),
        );

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toBe('Email atau password salah');
    });
  });

  // describe('/auth/current (GET)', () => {
  //   it('should return current user data', async () => {
  //     const currentUser = {
  //       id: '123',
  //       email: 'user@example.com',
  //       name: 'User',
  //       role: 'User',
  //       is_verified: true,
  //     };

  //     const response = await request(app.getHttpServer())
  //       .get('/auth/current')
  //       .set('Authorization', `Bearer valid-jwt-token`)
  //       .expect(200);

  //     expect(response.body).toEqual({
  //       message: 'Data pengguna berhasil diambil',
  //       statusCode: 200,
  //       data: currentUser,
  //     });
  //   });
  // });

  // describe('/auth/admin (GET)', () => {
  //   it('should allow access to admin data for role Admin', async () => {
  //     const adminData = {
  //       id: 'admin-id',
  //       email: 'admin@example.com',
  //       name: 'Admin User',
  //       role: 'Admin',
  //       is_verified: true,
  //     };

  //     const response = await request(app.getHttpServer())
  //       .get('/auth/admin')
  //       .set('Authorization', `Bearer admin-jwt-token`)
  //       .expect(200);

  //     expect(response.body).toEqual({
  //       message: 'Data admin berhasil diambil',
  //       statusCode: 200,
  //       data: adminData,
  //     });
  //   });
  // });
});
