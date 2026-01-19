import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { VehicleCategory, VehicleStatus } from '@prisma/client';

describe('Reservations (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let createdVehicleId: string;

  const testUser = {
    email: 'test_e2e_res@example.com',
    password: 'Password123!',
    firstName: 'Res',
    lastName: 'Tester',
  };

  const testVehicle = {
    brand: 'Toyota_E2E',
    model: 'TestRunner',
    year: 2024,
    plate: 'E2E-999',
    category: VehicleCategory.SUV,
    status: VehicleStatus.AVAILABLE,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);

    // 1. Cleanup Old Data
    await prisma.reservation.deleteMany({
      where: { user: { email: { contains: 'test_e2e_res' } } },
    });
    await prisma.vehicle.deleteMany({ where: { plate: { contains: 'E2E-' } } });
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_e2e_res' } },
    });

    // 2. Register via API (Simpler and gets real hash)
    await request(app.getHttpServer()).post('/auth/register').send(testUser);

    // 3. Login to get Token
    const validLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    if (!validLogin.body.access_token) {
      console.error('Login Failed during setup:', validLogin.body);
      throw new Error('Login failed setup');
    }
    jwtToken = validLogin.body.access_token;

    // 4. Create Vehicle via Prisma (Admin shortcut)
    const vehicle = await prisma.vehicle.create({
      data: testVehicle,
    });
    createdVehicleId = vehicle.id;
  });

  afterAll(async () => {
    // Cleanup
    if (createdVehicleId) {
      await prisma.reservation.deleteMany({
        where: { vehicleId: createdVehicleId },
      });
      await prisma.vehicle.deleteMany({ where: { id: createdVehicleId } });
    }
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_e2e_res' } },
    });
    await app.close();
  });

  it('/reservations/availability/check (GET) - should be available initially', () => {
    // Dates in future
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15);

    return request(app.getHttpServer())
      .get('/reservations/availability/check')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({
        vehicleId: createdVehicleId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.isAvailable).toBe(true);
      });
  });

  it('/reservations (POST) - should create reservation', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15);

    return request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        vehicleId: createdVehicleId,
        startDate: startDate,
        endDate: endDate,
        reason: 'E2E Test Mission',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.vehicleId).toBe(createdVehicleId);
      });
  });

  it('/reservations/availability/check (GET) - should detect conflict', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 12); // Clashes with 10-15
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 13);

    return request(app.getHttpServer())
      .get('/reservations/availability/check')
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({
        vehicleId: createdVehicleId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.isAvailable).toBe(false);
        expect(res.body.conflicts.length).toBeGreaterThan(0);
        // The conflict should mention who has it (our test user)
        expect(res.body.conflicts[0].bookedBy).toContain(testUser.firstName);
      });
  });
});
