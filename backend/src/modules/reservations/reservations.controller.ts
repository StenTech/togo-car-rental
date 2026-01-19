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
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
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
  @ApiOkResponse({
    description: 'Résultat de la vérification avec suggestions éventuelles.',
  })
  @ApiBadRequestResponse({
    description: 'Dates invalides ou format incorrect.',
  })
  @ApiNotFoundResponse({ description: 'Véhicule demandé inexistant.' })
  checkAvailability(@Query() query: CheckAvailabilityDto) {
    return this.reservationsService.checkAvailability(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Faire une demande de réservation (Auto-confirmée si disponible)',
  })
  @ApiCreatedResponse({ description: 'Réservation créée et confirmée.' })
  @ApiConflictResponse({
    description:
      "Véhicule déjà réservé sur ce créneau (Pas d'alternative trouvée).",
  })
  @ApiBadRequestResponse({
    description: 'Dates incohérentes (début > fin, passé).',
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
