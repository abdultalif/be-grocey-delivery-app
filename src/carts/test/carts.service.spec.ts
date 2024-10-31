import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from '../carts.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ValidationService } from 'src/common/services/validation.service';
import { Carts } from '../carts.entity';
import { Products } from 'src/products/products.entity';
import { Users } from 'src/users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateCartRequest } from '../cart.dto';

describe('CartsService', () => {
  let service: CartsService;
  let cartsRepository: Repository<Carts>;
  let productsRepository: Repository<Products>;
  let validationService: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: getRepositoryToken(Carts),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Products),
          useClass: Repository,
        },
        {
          provide: ValidationService,
          useValue: {
            validate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
    cartsRepository = module.get<Repository<Carts>>(getRepositoryToken(Carts));
    productsRepository = module.get<Repository<Products>>(
      getRepositoryToken(Products),
    );
    validationService = module.get<ValidationService>(ValidationService);
  });

  describe('create', () => {
    const mockUser: Users = { id: 'uuid-user' } as Users;
    const mockRequest = {
      product_id: 'uuid-product',
      quantity: 2,
      total: 100,
    } as any;
    const mockProduct = { id: 'uuid' } as Products;
    const mockCart = {
      id: 'uuid',
      quantity: 2,
      total: 100,
      user: mockUser,
      product: mockProduct,
    } as Carts;

    it('should validate request data', async () => {
      validationService.validate = jest.fn().mockReturnValue(mockRequest);
      productsRepository.findOne = jest.fn().mockResolvedValue(mockProduct);
      cartsRepository.findOne = jest.fn().mockResolvedValue(null);
      cartsRepository.save = jest.fn().mockResolvedValue(mockCart);

      await service.create(mockUser, mockRequest);
      expect(validationService.validate).toHaveBeenCalledWith(
        expect.anything(),
        mockRequest,
      );
    });

    it('should throw NotFoundException if product does not exist', async () => {
      validationService.validate = jest.fn().mockReturnValue(mockRequest);
      productsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.create(mockUser, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update existing cart if item already in cart', async () => {
      validationService.validate = jest.fn().mockReturnValue(mockRequest);
      productsRepository.findOne = jest.fn().mockResolvedValue(mockProduct);
      cartsRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(mockCart)
        .mockResolvedValueOnce({
          ...mockCart,
          quantity: mockCart.quantity + mockRequest.quantity,
          total: mockCart.total + mockRequest.total,
        });

      cartsRepository.update = jest.fn().mockResolvedValue(undefined);

      const result = await service.create(mockUser, mockRequest);

      expect(cartsRepository.update).toHaveBeenCalledWith(mockCart.id, {
        quantity: mockCart.quantity + mockRequest.quantity,
        total: mockCart.total + mockRequest.total,
      });

      expect(result).toEqual({
        id: mockCart.id,
        product_id: mockProduct.id,
        quantity: mockCart.quantity + mockRequest.quantity,
        total: mockCart.total + mockRequest.total,
        user_id: mockUser.id,
      });
    });

    it('should create a new cart item if product is not already in cart', async () => {
      validationService.validate = jest.fn().mockReturnValue(mockRequest);
      productsRepository.findOne = jest.fn().mockResolvedValue(mockProduct);
      cartsRepository.findOne = jest.fn().mockResolvedValue(null);
      cartsRepository.save = jest.fn().mockResolvedValue(mockCart);

      const result = await service.create(mockUser, mockRequest);

      expect(cartsRepository.save).toHaveBeenCalledWith({
        quantity: mockRequest.quantity,
        total: mockRequest.total,
        user: { id: mockUser.id },
        product: { id: mockRequest.product_id },
      });
      expect(result).toEqual({
        id: mockCart.id,
        product_id: mockProduct.id,
        quantity: mockCart.quantity,
        total: mockCart.total,
        user_id: mockUser.id,
      });
    });
  });

  describe('getAll', () => {
    const mockUser: Users = { id: '1' } as Users;
    const mockProduct = {
      id: 'uuid',
      name: 'Product 1',
      price: 50,
      stock: 100,
      category: 'Category 1',
      weight: 1.2,
      image: 'image_url',
      description: 'Product description',
    };
    const mockCart = {
      id: '1',
      quantity: 2,
      total: 100,
      product: mockProduct,
      user: mockUser,
    };

    it('should return a list of cart items for the user', async () => {
      cartsRepository.find = jest.fn().mockResolvedValue([mockCart]);

      const result = await service.getAll(mockUser);

      expect(cartsRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['product', 'user'],
        select: {
          id: true,
          quantity: true,
          total: true,
          product: {
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true,
            weight: true,
            image: true,
            description: true,
          },
          user: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      });

      expect(result).toEqual([
        {
          id: mockCart.id,
          product: mockProduct,
          quantity: mockCart.quantity,
          total: mockCart.total,
          user: mockUser,
        },
      ]);
    });
  });

  describe('deleteAll', () => {
    const mockUser: Users = { id: '1' } as Users;
    const mockProduct = { id: '1' } as Products;
    const mockCart = {
      id: '1',
      quantity: 2,
      total: 100,
      product: mockProduct,
      user: mockUser,
    } as Carts;

    it('should throw NotFoundException if no carts are found for the user', async () => {
      cartsRepository.find = jest.fn().mockResolvedValue([]);

      await expect(service.deleteAll(mockUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(cartsRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['product', 'user'],
      });
    });

    it('should delete all carts for the user and return cart data', async () => {
      cartsRepository.find = jest.fn().mockResolvedValue([mockCart]);
      cartsRepository.delete = jest.fn().mockResolvedValue({});

      const result = await service.deleteAll(mockUser);

      expect(cartsRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['product', 'user'],
      });
      expect(cartsRepository.delete).toHaveBeenCalledWith({
        user: { id: mockUser.id },
      });

      expect(result).toEqual([
        {
          id: mockCart.id,
          quantity: mockCart.quantity,
          total: mockCart.total,
          product_id: mockProduct.id,
          user_id: mockUser.id,
        },
      ]);
    });
  });

  describe('deleteById', () => {
    const mockUser: Users = { id: '1' } as Users;
    const mockCartId = '1';
    const mockProduct = { id: '1' } as Products;
    const mockCart = {
      id: '1',
      quantity: 2,
      total: 100,
      product: mockProduct,
      user: mockUser,
    } as Carts;

    it('should throw NotFoundException if cart is not found', async () => {
      cartsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.deleteById(mockUser, mockCartId)).rejects.toThrow(
        NotFoundException,
      );
      expect(cartsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCartId, user: { id: mockUser.id } },
        relations: ['product', 'user'],
      });
    });

    it('should delete cart if it exists and return the deleted cart data', async () => {
      cartsRepository.findOne = jest.fn().mockResolvedValue(mockCart);
      cartsRepository.delete = jest.fn().mockResolvedValue(undefined);

      const result = await service.deleteById(mockUser, mockCartId);

      expect(cartsRepository.delete).toHaveBeenCalledWith({ id: mockCartId });
      expect(result).toEqual({
        id: mockCart.id,
        quantity: mockCart.quantity,
        total: mockCart.total,
        product_id: mockProduct.id,
        user_id: mockUser.id,
      });
    });
  });

  describe('getById', () => {
    const mockUser: Users = { id: 'uuid-user' } as Users;
    const mockCartId = '1';
    const mockProduct = {
      id: '1',
      name: 'Infinix NOTE 11 ',
      price: 100,
      stock: 50,
      category: 'Handphone',
      weight: 200,
      image: 'imagekit-url',
      description: 'Description',
    };
    const mockCart = {
      id: mockCartId,
      quantity: 2,
      total: 200,
      product: mockProduct,
      user: {
        id: mockUser.id,
        email: 'user@example.com',
        name: 'Sample User',
        role: 'customer',
      },
    };

    it('should throw NotFoundException if cart is not found', async () => {
      cartsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getById(mockUser, mockCartId)).rejects.toThrow(
        NotFoundException,
      );
      expect(cartsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCartId, user: { id: mockUser.id } },
        relations: ['product', 'user'],
        select: {
          id: true,
          quantity: true,
          total: true,
          product: {
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true,
            weight: true,
            image: true,
            description: true,
          },
          user: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      });
    });

    it('should return the cart data if found', async () => {
      cartsRepository.findOne = jest.fn().mockResolvedValue(mockCart);

      const result = await service.getById(mockUser, mockCartId);

      expect(result).toEqual({
        id: mockCart.id,
        quantity: mockCart.quantity,
        total: mockCart.total,
        product: mockProduct,
        user: mockCart.user,
      });
      expect(cartsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCartId, user: { id: mockUser.id } },
        relations: ['product', 'user'],
        select: {
          id: true,
          quantity: true,
          total: true,
          product: {
            id: true,
            name: true,
            price: true,
            stock: true,
            category: true,
            weight: true,
            image: true,
            description: true,
          },
          user: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      });
    });
  });

  describe('patch', () => {
    const mockUser: Users = { id: 'uuid-user' } as Users;
    const mockCartId = '1';
    const mockRequest = { quantity: 3, total: 150 } as UpdateCartRequest;
    const mockProduct = { id: 'uuid-product' } as Products;
    const mockCart = {
      id: 'uuid',
      quantity: 2,
      total: 100,
      product: mockProduct,
      user: mockUser,
    } as Carts;

    it('should throw NotFoundException if cart is not found', async () => {
      cartsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.patch(mockUser, mockCartId, mockRequest),
      ).rejects.toThrow(NotFoundException);
      expect(cartsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCartId, user: { id: mockUser.id } },
        relations: ['product', 'user'],
      });
    });

    it('should validate request data using validationService', async () => {
      cartsRepository.findOne = jest.fn().mockResolvedValue(mockCart);
      validationService.validate = jest.fn().mockReturnValue(mockRequest);
      cartsRepository.save = jest.fn().mockResolvedValue({
        ...mockCart,
        quantity: mockRequest.quantity,
        total: mockRequest.total,
      });

      await service.patch(mockUser, mockCartId, mockRequest);

      expect(validationService.validate).toHaveBeenCalledWith(
        expect.anything(),
        mockRequest,
      );
    });

    it('should update and return the updated cart data', async () => {
      cartsRepository.findOne = jest.fn().mockResolvedValue(mockCart);
      validationService.validate = jest.fn().mockReturnValue(mockRequest);
      cartsRepository.save = jest.fn().mockResolvedValue({
        ...mockCart,
        quantity: mockRequest.quantity,
        total: mockRequest.total,
      });

      const result = await service.patch(mockUser, mockCartId, mockRequest);

      expect(cartsRepository.save).toHaveBeenCalledWith({
        ...mockCart,
        quantity: mockRequest.quantity,
        total: mockRequest.total,
      });
      expect(result).toEqual({
        id: mockCart.id,
        quantity: mockRequest.quantity,
        total: mockRequest.total,
        product: mockProduct,
        user: mockUser,
      });
    });
  });
});
