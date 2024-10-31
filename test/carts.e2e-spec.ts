// import { HttpStatus, INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { JwtAuthGuard } from 'src/auth/auth.guard';
// import { CreateCartRequest } from 'src/carts/cart.dto';
// import { CartsModule } from 'src/carts/carts.module';
// import { CartsService } from 'src/carts/carts.service';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import request from 'supertest';

// describe('CartsController (e2e)', () => {
//   let app: INestApplication;
//   let cartsService: CartsService;
//   const mockToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMDM2NzRlLTI2ZjctNDEzOC04ZGRjLTVkOTMzMTM2MDliOSIsImVtYWlsIjoiYWJkdWx0YWxpZjU1QGdtYWlsLmNvbSIsIm5hbWUiOiJUYWxpZiIsInJvbGUiOiJVc2VyIiwiaXNfdmVyaWZpZWQiOnRydWUsImlhdCI6MTczMDMwNTY3MiwiZXhwIjoxNzYxODYzMjcyfQ.kLfHcvHFPhXFQAmVvpjjpBTV6a1bYBR1JDcir0napxI';

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [CartsModule],
//     })
//       .overrideProvider(JwtAuthGuard)
//       .useValue({
//         canActivate: () => true, // melewati otentikasi
//       })
//       .overrideProvider(RolesGuard)
//       .useValue({
//         canActivate: () => true, // melewati guard roles
//       })
//       .compile();

//     app = moduleFixture.createNestApplication();
//     cartsService = moduleFixture.get<CartsService>(CartsService);

//     await app.init();
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   describe('POST /api/v1/carts', () => {
//     it('should create a cart successfully', async () => {
//       const requestDataCart: CreateCartRequest = {
//         product_id: 'uuid-product',
//         quantity: 5,
//         total: 10000,
//       };

//       jest.spyOn(cartsService, 'create').mockImplementation(async () => ({
//         id: 'uuid',
//         product_id: requestDataCart.product_id,
//         quantity: requestDataCart.quantity,
//         total: requestDataCart.total,
//         user_id: 'uuid-user',
//       }));

//       const response = await request(app.getHttpServer())
//         .post('/api/v1/carts')
//         .set('Authorization', mockToken) // gunakan mockToken yang diubah menjadi string `Bearer valid-token-for-testing`
//         .send(requestDataCart)
//         .expect(HttpStatus.CREATED);

//       expect(response.body).toEqual({
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
