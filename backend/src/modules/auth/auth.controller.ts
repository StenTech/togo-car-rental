import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscrire un nouvel employé' })
  @ApiResponse({ status: 201, description: 'Utilisateur inscrit avec succès' })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, user } = await this.authService.register(createUserDto);

    // Set HttpOnly Cookie
    response.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { user, access_token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion (Obtenir JWT)' })
  @ApiResponse({
    status: 200,
    description: 'Authentification réussie, retourne le token',
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, user } = await this.authService.login(loginDto);

    // Set HttpOnly Cookie
    response.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in prod
      sameSite: 'lax', // Important pour l'envoi de cookies cross-origin (si localhost diff ports)
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { user, access_token }; // On retourne quand même le token pour info, mais le cookie est la clé
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déconnexion' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication');
    return { message: 'Déconnexion réussie' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Obtenir le profil de l'utilisateur connecté (Protegé)",
  })
  getProfile(
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    return user;
  }
}
