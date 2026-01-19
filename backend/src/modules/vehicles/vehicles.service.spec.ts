import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, VehicleCategory, VehicleStatus } from '@prisma/client';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    vehicle: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockVehicle = {
    id: 'vehicle-123',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    plate: 'TG-1234',
    category: VehicleCategory.SEDAN,
    status: VehicleStatus.AVAILABLE,
    imageUrl: 'http://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a vehicle', async () => {
      const createVehicleDto = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        plate: 'TG-1234',
        category: VehicleCategory.SEDAN,
        imageUrl: 'http://example.com/image.jpg',
      };

      mockPrismaService.vehicle.create.mockResolvedValue(mockVehicle);

      const result = await service.create(createVehicleDto);

      expect(prisma.vehicle.create).toHaveBeenCalledWith({
        data: createVehicleDto,
      });
      expect(result).toEqual(mockVehicle);
    });

    it('should throw ConflictException if plate already exists', async () => {
      const createVehicleDto = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        plate: 'TG-1234',
        category: VehicleCategory.SEDAN,
      };

      mockPrismaService.vehicle.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2002',
          clientVersion: '5.0.0',
        }),
      );

      await expect(service.create(createVehicleDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      mockPrismaService.vehicle.findMany.mockResolvedValue([mockVehicle]);

      const result = await service.findAll();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle if found', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);

      const result = await service.findOne('vehicle-123');
      expect(result).toEqual(mockVehicle);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.findOne('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
