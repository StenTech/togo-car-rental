import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('availability/check')
  @ApiOperation({
    summary: 'Assistant intelligent de disponibilité (check & suggest)',
    description:
      'Vérifie si un véhicule est libre. Sinon, retourne les conflits (qui a réservé) et propose des alternatives (véhicules libres de même catégorie).',
  })
  checkAvailability(@Query() query: CheckAvailabilityDto) {
    return this.reservationsService.checkAvailability(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Faire une demande de réservation (Auto-confirmée si disponible)',
  })
  @ApiResponse({ status: 201, description: 'Réservation confirmée.' })
  @ApiResponse({
    status: 409,
    description: 'Véhicule indisponible sur ce créneau.',
  })
  create(
    @CurrentUser() user: User,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationsService.create(user, createReservationDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Voir mes réservations' })
  findMyReservations(@CurrentUser() user: User) {
    return this.reservationsService.findMyReservations(user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Voir toutes les réservations (Admin)' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Annuler ma réservation' })
  cancel(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.cancel(user.id, id);
  }
}
