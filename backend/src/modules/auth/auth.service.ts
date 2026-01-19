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
    const user = await this.usersService.create(createUserDto);
    
    // Générer le JWT pour auto-login
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    // On retire le mot de passe de la réponse (sécurité)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    
    return {
      access_token,
      user: result,
    };
  }

  async login(loginDto: LoginDto) {
    console.log(`[AuthDebug] Tentative de connexion pour : ${loginDto.email}`);

    // 1. Trouver l'utilisateur
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      console.log(`[AuthDebug] Utilisateur introuvable en base.`);
      // On reste flou sur l'erreur pour ne pas aider les attaquants (User Enumeration)
      throw new UnauthorizedException('Identifiants incorrects');
    }

    console.log(`[AuthDebug] Utilisateur trouvé. Hash en base : ${user.password.substring(0, 10)}...`);

    // 2. Vérifier le mot de passe
    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );
    
    console.log(`[AuthDebug] Résultat comparaison mot de passe : ${isPasswordValid}`);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 3. Générer le JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }
}
