import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckAvailabilityDto {
  @ApiProperty({
    description: 'ID du véhicule souhaité',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    description: 'Date de début souhaitée (ISO 8601)',
    example: '2024-05-20T08:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Date de fin souhaitée (ISO 8601)',
    example: '2024-05-22T18:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
