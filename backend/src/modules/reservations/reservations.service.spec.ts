import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { ReservationStatus, UserRole, VehicleCategory } from '@prisma/client';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let prisma: PrismaService;

  // Mock du PrismaService
  const mockPrismaService = {
    vehicle: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    reservation: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@user.com',
    role: UserRole.USER,
    firstName: 'John',
    lastName: 'Doe',
    password: 'hash',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockVehicle = {
    id: 'vehicle-123',
    brand: 'Toyota',
    model: 'SUV',
    category: VehicleCategory.SUV,
    status: 'AVAILABLE',
    createdAt: new Date(),
    updatedAt: new Date(),
    year: 2022,
    plate: 'TG-123',
    imageUrl: null,
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a reservation if no conflict', async () => {
      // PRO TIP: Utiliser des dates relatives pour éviter l'erreur "Date in past"
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 5);

      const dto = {
        vehicleId: 'vehicle-123',
        startDate: tomorrow,
        endDate: dayAfter,
        reason: 'Mission',
      };

      // Mock Vehicle Exists & Available
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);
      // Mock No Conflict
      mockPrismaService.reservation.findFirst.mockResolvedValue(null);
      // Mock Creation
      mockPrismaService.reservation.create.mockResolvedValue({
        id: 'res-1',
        ...dto,
        status: ReservationStatus.CONFIRMED,
      });

      const result = await service.create(mockUser, dto);
      expect(result).toBeDefined();
      expect(prisma.reservation.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if overlap exists', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 5);

      const dto = {
        vehicleId: 'vehicle-123',
        startDate: tomorrow,
        endDate: dayAfter,
        reason: 'Mission',
      };

      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);
      // Mock Conflict Exists
      mockPrismaService.reservation.findFirst.mockResolvedValue({
        id: 'conflict-1',
      });

      await expect(service.create(mockUser, dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequest if endDate < startDate', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const dto = {
        vehicleId: 'vehicle-123',
        startDate: tomorrow,
        endDate: yesterday, // Error
        reason: 'Mission',
      };

      await expect(service.create(mockUser, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('checkAvailability', () => {
    it('should return available=true and no conflicts if clear', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);
      // No conflicts found for target vehicle
      mockPrismaService.reservation.findMany.mockResolvedValue([]);

      const result = await service.checkAvailability({
        vehicleId: 'vehicle-123',
        startDate: '2025-01-01',
        endDate: '2025-01-05',
      });

      expect(result.isAvailable).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should suggest alternatives if target is booked', async () => {
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockVehicle);

      // Target vehicle has a conflict
      mockPrismaService.reservation.findMany.mockResolvedValue([
        {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-05'),
          user: { firstName: 'Alice', lastName: 'Smith' },
          reason: 'Other mission',
        },
      ]);

      // Find 1 candidate vehicle of same category
      const candidateVehicle = { ...mockVehicle, id: 'vehicle-456' };
      mockPrismaService.vehicle.findMany.mockResolvedValue([candidateVehicle]);

      // Candidate has NO conflict
      mockPrismaService.reservation.findFirst.mockResolvedValue(null);

      const result = await service.checkAvailability({
        vehicleId: 'vehicle-123',
        startDate: '2025-01-01',
        endDate: '2025-01-05',
      });

      expect(result.isAvailable).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.alternatives).toHaveLength(1);
      expect(result.alternatives[0].id).toBe('vehicle-456');
    });
  });
});
