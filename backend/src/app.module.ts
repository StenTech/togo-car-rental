import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { envValidationSchema } from './config/env.validation';
import { UsersModule } from './modules/users/users.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
