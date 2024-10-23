// import { Test, TestingModule } from '@nestjs/testing';
// import { BadRequestException } from '@nestjs/common';
// import * as request from 'supertest';
// import { INestApplication } from '@nestjs/common';
// import { AuthController } from 'src/auth/auth.controller';
// import { AuthService } from 'src/auth/auth.service';
// import { RegisterUserRequest } from 'src/auth/auth.dto';

// describe('AuthController - Register API', () => {
//   let app: INestApplication;
//   let authController: AuthController;
//   let authService: AuthService;

//   const mockAuthService = {
//     register: jest.fn(),
//   };

//   const mockRequest: RegisterUserRequest = {
//     email: 'test@example.com',
//     name: 'Test User',
//     password: 'TestPassword123!',
//     confirmPassword: 'TestPassword123!',
//   };

//   const mockResponse = {
//     id: 'uuid123',
//     email: 'test@example.com',
//     name: 'Test User',
//     role: 'User',
//     is_verified: true,
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: mockAuthService,
//         },
//       ],
//     }).compile();

//     app = module.createNestApplication();
//     await app.init();

//     authController = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//   });

//   afterEach(async () => {
//     await app.close();
//   });

//   it('should register a user and return the correct response', async () => {
//     mockAuthService.register.mockResolvedValue(mockResponse);

//     const response = await request(app.getHttpServer())
//       .post('/api/v1/users')
//       .send(mockRequest)
//       .expect(201);

//     expect(response.body).toEqual({
//       message: 'User created successfully',
//       statusCode: 201,
//       data: mockResponse,
//     });
//     expect(mockAuthService.register).toHaveBeenCalledWith(mockRequest);
//   });

//   it('should return 400 if email already exists', async () => {
//     mockAuthService.register.mockRejectedValue(
//       new BadRequestException('Email Already Exist'),
//     );

//     const response = await request(app.getHttpServer())
//       .post('/api/v1/users')
//       .send(mockRequest)
//       .expect(400);

//     expect(response.body.message).toBe('Email Already Exist');
//   });
// });
