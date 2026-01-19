import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { envValidationSchema } from './config/env.validation';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [
    // Configuration centralisée avec validation stricte
    ConfigModule.forRoot({
      isGlobal: true, // Disponible partout sans import
      validationSchema: envValidationSchema,
      envFilePath: '../.env', // Chemin vers le fichier .env racine
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    VehiclesModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
