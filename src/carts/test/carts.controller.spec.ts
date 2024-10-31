import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from '../carts.controller';
import { CartsService } from '../carts.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Users } from 'src/users/users.entity';
import {
  CartResponse,
  CartsResponse,
  CreateCartRequest,
  UpdateCartRequest,
} from '../cart.dto';
import { HttpStatus } from '@nestjs/common';
import { WebResponse } from 'src/common/types/web-response.type';

describe('CartsController', () => {
  let controller: CartsController;
  let cartsService: CartsService;

  const mockUser: Users = { id: 'uuid-user' } as Users;
  const mockCartId = 'uuid';
  const mockCartData: CartsResponse = {
    id: mockCartId,
    quantity: 2,
    total: 100,
    product: {
      id: 'uuid',
      name: 'Infinix NOTE 11 NFC',
      price: '50',
      stock: '100',
      category: 'Handphone',
      weight: '1.2',
      image: 'imagekit_url',
      description: 'description',
    },
    user: mockUser,
  };
  const mockCartArray: CartsResponse[] = [{ ...mockCartData }];

  const mockCartsService = {
    create: jest.fn().mockResolvedValue(mockCartData),
    getAll: jest.fn().mockResolvedValue(mockCartArray),
    getById: jest.fn().mockResolvedValue(mockCartData),
    deleteById: jest.fn().mockResolvedValue(mockCartData),
    deleteAll: jest.fn().mockResolvedValue(mockCartArray),
    patch: jest.fn().mockResolvedValue(mockCartData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        {
          provide: CartsService,
          useValue: mockCartsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CartsController>(CartsController);
    cartsService = module.get<CartsService>(CartsService);
  });

  describe('create', () => {
    it('should create a cart item', async () => {
      const createCartDto: CreateCartRequest = {
        quantity: 1,
        product_id: 'uuid-product',
        total: 100,
      };
      const result: WebResponse<CartResponse> = await controller.create(
        mockUser,
        createCartDto,
      );

      expect(cartsService.create).toHaveBeenCalledWith(mockUser, createCartDto);
      expect(result).toEqual({
        message: 'berhasil menambah data keranjang',
        statusCode: HttpStatus.CREATED,
        data: mockCartData,
      });
    });
  });

  describe('getAll', () => {
    it('should get all cart items for user', async () => {
      const result: WebResponse<CartsResponse[]> =
        await controller.getAll(mockUser);

      expect(cartsService.getAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        message: 'Data keranjang berhasil diambil',
        statusCode: HttpStatus.OK,
        data: mockCartArray,
      });
    });
  });

  describe('getById', () => {
    it('should get a cart item by id', async () => {
      const result: WebResponse<CartsResponse> = await controller.getById(
        mockUser,
        mockCartId,
      );

      expect(cartsService.getById).toHaveBeenCalledWith(mockUser, mockCartId);
      expect(result).toEqual({
        message: `Data keranjang id: ${mockCartId} berhasil diambil`,
        statusCode: HttpStatus.OK,
        data: mockCartData,
      });
    });
  });

  describe('deleteById', () => {
    it('should delete a cart item by id', async () => {
      const result: WebResponse<CartResponse> = await controller.deleteById(
        mockUser,
        mockCartId,
      );

      expect(cartsService.deleteById).toHaveBeenCalledWith(
        mockUser,
        mockCartId,
      );
      expect(result).toEqual({
        message: `Data keranjang id: ${mockCartId} berhasil dihapus`,
        statusCode: HttpStatus.OK,
        data: mockCartData,
      });
    });
  });

  describe('deleteAll', () => {
    it('should delete all cart items for user', async () => {
      const result: WebResponse<CartResponse[]> =
        await controller.deleteAll(mockUser);

      expect(cartsService.deleteAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        message: 'Data keranjang berhasil dihapus',
        statusCode: HttpStatus.OK,
        data: mockCartArray,
      });
    });
  });

  describe('patch', () => {
    it('should update a cart item', async () => {
      const updateCartDto: UpdateCartRequest = { quantity: 3 };
      const result: WebResponse<CartResponse> = await controller.patch(
        mockUser,
        mockCartId,
        updateCartDto,
      );

      expect(cartsService.patch).toHaveBeenCalledWith(
        mockUser,
        mockCartId,
        updateCartDto,
      );
      expect(result).toEqual({
        message: `Data keranajang ID: ${mockCartId} berhasil diupdate`,
        statusCode: HttpStatus.OK,
        data: mockCartData,
      });
    });
  });
});
