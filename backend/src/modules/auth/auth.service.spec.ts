import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../../common/providers/hashing.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let hashingService: HashingService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockHashingService = {
    compare: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: UserRole.USER,
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: HashingService, useValue: mockHashingService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    hashingService = module.get<HashingService>(HashingService);

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access_token on valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login(loginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(hashingService.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(result).toEqual({ access_token: 'jwt-token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = { email: 'wrong@example.com', password: 'password123' };
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register user and return result without password', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result).not.toHaveProperty('password');
    });
  });
});
