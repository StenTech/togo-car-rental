import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    try {
      return await this.prisma.vehicle.create({
        data: createVehicleDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Un véhicule avec l'immatriculation ${createVehicleDto.plate} existe déjà.`,
        );
      }
      throw new InternalServerErrorException(
        'Erreur lors de la création du véhicule',
      );
    }
  }

  findAll() {
    return this.prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(`Véhicule #${id} introuvable`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    try {
      // Vérifier si le véhicule existe
      await this.findOne(id);

      return await this.prisma.vehicle.update({
        where: { id },
        data: updateVehicleDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `L'immatriculation ${updateVehicleDto.plate} est déjà utilisée par un autre véhicule.`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    // Vérifier si le véhicule existe
    await this.findOne(id);

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
