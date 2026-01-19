import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';

@Global() // Rendre global pour éviter de l'importer partout si utilisé fréquemment
@Module({
  imports: [ConfigModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
