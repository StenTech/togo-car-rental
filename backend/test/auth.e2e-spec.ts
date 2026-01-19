import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Important: Appliquer les mêmes pipes que main.ts pour la validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get(PrismaService);

    // Cleanup initial pour éviter les conflits
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_e2e_auth' } },
    });
  });

  afterAll(async () => {
    // Cleanup final
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_e2e_auth' } },
    });
    await app.close();
  });

  const testUser = {
    email: 'test_e2e_auth@example.com',
    password: 'Password123!',
    firstName: 'Jean',
    lastName: 'E2E',
  };

  it('/auth/register (POST) - should create a user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toEqual(testUser.email);
        expect(res.body.password).toBeUndefined();
      });
  });

  it('/auth/register (POST) - should fail on duplicate email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409);
  });

  it('/auth/login (POST) - should return JWT token', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - should fail with wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword' })
      .expect(401);
  });
});
