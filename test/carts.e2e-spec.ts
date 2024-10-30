// import { HttpStatus, INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { CartResponse, CreateCartRequest } from 'src/carts/cart.dto';
// import { CartsModule } from 'src/carts/carts.module';
// import { CartsService } from 'src/carts/carts.service';
// import request from 'supertest';

// describe('CartsController (e2e)', () => {
//   let app: INestApplication;
//   let cartsService: CartsService;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [CartsModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     cartsService = moduleFixture.get<CartsService>(CartsService);

//     await app.init();
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   describe('POST /api/v1/carts', () => {
//     it('should throw error for carts not found', async () => {
//       const requestDataCart: CreateCartRequest = {
//         product_id: 'uuid-product',
//         quantity: 5,
//         total: 10000,
//       };

//       jest
//         .spyOn(cartsService, 'create')
//         .mockImplementation(async () => ({
//             id: '123',
//             quantity: requestDataCart.quantity,
//             name: registerData.name,
//             role: 'User',
//             is_verified: true,
//           }));
//       const response = await request(app.getHttpServer())
//         .post('/api/v1/carts')
//         .send(requestDataCart)
//         .expect(201);

//       expect(response).toEqual({
//         message: 'berhasil menambah data keranjang',
//         statusCode: 201,
//         data: {
//           id: 'uuid',
//           product_id: 'uuid-product',
//           quantity: 5,
//           total: 10000,
//           user_id: 'uuid-user',
//         },
//       });
//     });
//   });
// });
