import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { HashingService } from '../../common/providers/hashing.service';
import { ConflictException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let hashingService: HashingService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockHashingService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedpassword',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: HashingService, useValue: mockHashingService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    hashingService = module.get<HashingService>(HashingService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockHashingService.hash.mockResolvedValue('hashedpassword');
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith('password123');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedpassword',
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException on duplicate email', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockHashingService.hash.mockResolvedValue('hashedpassword');
      mockPrismaService.user.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2002',
          clientVersion: '5.0.0',
        }),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });
});
