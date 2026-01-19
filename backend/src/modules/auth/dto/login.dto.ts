import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@togodatalab.tg',
    description: "Email de l'utilisateur",
  })
  @IsEmail({}, { message: "L'email fournit n'est pas valide." })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecureP@ss123', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
