import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from '../../common/providers/hashing.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 1. Hachage du mot de passe
      const hashedPassword = await this.hashingService.hash(
        createUserDto.password,
      );

      // 2. Création de l'utilisateur
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      // Gestion de l'erreur d'unicité (P2002 code Prisma)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Cet email est déjà utilisé.');
      }
      throw new InternalServerErrorException(
        "Erreur lors de la création de l'utilisateur.",
      );
    }
  }

  async findAll() {
    // Attention : Toujours exclure le mot de passe dans un vrai projet
    // Ici nous le faisons simplement pour l'exercice, idéalement utiliser un Interceptor "Exclude"
    return this.prisma.user.findMany({
      where: { deletedAt: null }, // Filtrage soft delete
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user || user.deletedAt) {
      throw new NotFoundException(`Utilisateur #${id} introuvable.`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    // On ne jette pas d'erreur ici car c'est utilisé par le login qui doit gérer l'absence discrètement
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Si mise à jour mot de passe, il faut le re-hacher
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashingService.hash(
        updateUserDto.password,
      );
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Utilisateur #${id} introuvable.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    // Soft delete
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
