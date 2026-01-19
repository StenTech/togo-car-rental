import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashingService } from '../../common/providers/hashing.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, HashingService],
  exports: [UsersService], // Exporté pour être utilisé par le module Auth plus tard
})
export class UsersModule {}
