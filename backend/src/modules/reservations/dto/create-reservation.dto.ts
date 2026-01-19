import { IsDate, IsNotEmpty, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID du véhicule à réserver',
  })
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    example: '2024-05-20T08:00:00.000Z',
    description: 'Date et heure de début',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    example: '2024-05-22T18:00:00.000Z',
    description: 'Date et heure de fin',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    example: 'Déplacement client à Kara',
    description: 'Motif professionnel du déplacement',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
