import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleCategory, VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota', description: 'La marque du véhicule' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Corolla', description: 'Le modèle du véhicule' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2022, description: "L'année de fabrication" })
  @IsInt()
  @Min(2000)
  year: number;

  @ApiProperty({ example: 'TG-1234-AB', description: 'Immatriculation unique' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({
    enum: VehicleCategory,
    example: VehicleCategory.SEDAN,
    description: 'Catégorie du véhicule',
  })
  @IsEnum(VehicleCategory)
  @IsNotEmpty()
  category: VehicleCategory;

  @ApiProperty({ example: 25000, description: 'Prix journalier en FCFA' })
  @IsNumber()
  @Min(0)
  dailyRate: number;

  @ApiProperty({
    enum: VehicleStatus,
    example: VehicleStatus.AVAILABLE,
    description: 'Statut du véhicule',
    required: false,
  })
  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;
}
