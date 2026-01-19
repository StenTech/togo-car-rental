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
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
// Fix pour TS1272 : Import explicite du type si utilisé uniquement en typage
import type { User } from '@prisma/client';
import { UserRole } from '@prisma/client';

// Import type nécessaire pour éviter l'erreur TS1272 avec isolatedModules
// Cependant, NestJS utilise les types pour l'injection, donc on doit faire attention.
// L'erreur spécifique "A type referenced in a decorated signature must be imported..." 
// suggère ici qu'il faut utiliser la classe concrète si on veut des métadonnées,
// ou que User est un type prisma généré.
// Prisma génère des types. Essayons de réimporter de façon explicite ou passer 'any' dans le decorateur si besoin,
// mais ici c'est juste le typage typescript qui râle.
// Une solution classique est de ne pas utiliser le type Prisma directement dans la signature du controlleur 
// si NestJS essaie de l'utiliser pour la DI (ce qu'il ne fait pas pour @CurrentUser normalement).
// Le fix simple est souvent de s'assurer que c'est bien une valeur importée ou d'utiliser un DTO si possible.
// Mais pour User de prisma, c'est une interface/type.
// On va laisser l'import tel quel mais vérifier tsconfig ou utiliser un DTO User si nécessaire.
// Tentative : utiliser un alias ou vérifier l'import.


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

  @Post(':id/pickup')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Marquer le départ du véhicule (Admin)',
    description:
      'Passe le statut à IN_PROGRESS. Indique que le client a récupéré les clés.',
  })
  @ApiOkResponse({ description: 'Statut mis à jour vers IN_PROGRESS.' })
  @ApiBadRequestResponse({
    description: 'Mauvais état initial (doit être PENDING/CONFIRMED).',
  })
  pickup(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.markAsPickedUp(id);
  }

  @Post(':id/return')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Marquer le retour du véhicule (Admin)',
    description: 'Passe le statut à COMPLETED. Le véhicule est rendu.',
  })
  @ApiOkResponse({ description: 'Statut mis à jour vers COMPLETED.' })
  @ApiBadRequestResponse({
    description: 'Mauvais état initial (doit être IN_PROGRESS).',
  })
  returnVehicle(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.markAsReturned(id);
  }
}
