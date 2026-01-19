import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { HashingService } from '../../common/providers/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // L'utilisateur est créé par le UsersService qui gère déjà le hachage
    // Mais on pourrait vouloir retourner un token directement après l'inscription
    const user = await this.usersService.create(createUserDto);
    // On retire le mot de passe de la réponse (sécurité)
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    // 1. Trouver l'utilisateur
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      // On reste flou sur l'erreur pour ne pas aider les attaquants (User Enumeration)
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 2. Vérifier le mot de passe
    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 3. Générer le JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
