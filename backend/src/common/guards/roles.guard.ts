import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestWithUser } from '../../modules/auth/interfaces/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si aucun rôle n'est spécifié (@Roles n'est pas utilisé), accès autorisé
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Si l'utilisateur n'est pas identifié ou n'a pas de rôle, accès refusé
    if (!user || !user.role) {
      return false;
    }

    // Vérifie si le rôle de l'utilisateur correspond aux rôles requis
    // Cast user.role to ensure strict comparison with UserRole enum
    return requiredRoles.some((role) => user.role === role);
  }
}
