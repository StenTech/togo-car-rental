import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { StorageService } from '../storage/storage.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let storageService: StorageService;
  let vehiclesService: VehiclesService;

  const mockVehiclesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    storageService = module.get<StorageService>(StorageService);
    vehiclesService = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload file and update vehicle', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('fake-image'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const vehicleId = 'some-uuid';
      const expectedUrl = 'http://minio/bucket/test.jpg';

      mockStorageService.uploadFile.mockResolvedValue(expectedUrl);
      mockVehiclesService.update.mockResolvedValue({
        id: vehicleId,
        imageUrl: expectedUrl,
      });

      const result = await controller.uploadImage(vehicleId, mockFile);

      expect(storageService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'vehicles',
      );
      expect(vehiclesService.update).toHaveBeenCalledWith(vehicleId, {
        imageUrl: expectedUrl,
      });
      expect(result).toEqual({ id: vehicleId, imageUrl: expectedUrl });
    });
  });
});
