import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle n'est spécifié (@Roles n'est pas utilisé), accès autorisé
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Si l'utilisateur n'est pas identifié ou n'a pas de rôle, accès refusé
    if (!user || !user.role) {
      return false;
    }

    // Vérifie si le rôle de l'utilisateur correspond aux rôles requis
    return requiredRoles.some((role) => user.role === role);
  }
}
