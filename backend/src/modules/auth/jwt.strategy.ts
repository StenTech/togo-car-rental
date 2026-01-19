import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Extraction du token depuis le header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Rejette automatiquement les tokens expirés
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Cette méthode est appelée si le token est valide et décodé
  async validate(payload: any) {
    // Le payload contient ce qu'on a mis dans le token (sub, email, role)
    // On retourne un objet simple qui sera injecté dans request.user
    if (!payload.sub) {
        throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
