import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@togodatalab.tg', description: 'Email professionnel unique' })
  @IsEmail({}, { message: "L'email doit être valide" })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecureP@ss123', description: 'Mot de passe fort (8+ chars, 1 Maj, 1 Chiffre, 1 Spécial)' })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe est trop faible (Requis: Majuscule, Minuscule, Chiffre ou Spécial)',
  })
  password: string;

  @ApiProperty({ example: 'John', description: 'Prénom de l\'employé' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Nom de famille de l\'employé' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER, description: 'Rôle de l\'utilisateur' })
  @IsEnum(UserRole)
  // Le rôle est optionnel à la création publique (défaut: USER), 
  // mais pourrait être forcé par un admin.
  role?: UserRole;
}
