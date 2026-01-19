import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(), // JSON structuré pour la prod (ELK/Datadog ready)
          ),
        }),
        // On pourrait ajouter ici un transport fichier ou CloudWatch
      ],
    }),
  });

  // 1. Sécurité (Helmet)
  app.use(helmet());
  app.use(cookieParser());

  // 2. CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true,
  });

  // 3. Validation Globale (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Retire les propriétés non décorées des DTOs
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés inconnues
      transform: true, // Transforme les payloads en instances de DTO
    }),
  );

  // 4. Gestion Globale des Erreurs
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Logging Global
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 6. Documentation Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('Togo Car Rental API')
    .setDescription('API de gestion de flotte automobile')
    .setVersion('1.0')
    .addBearerAuth() // Support pour l'auth JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Préfixe global pour les routes API
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
