import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../../modules/auth/interfaces/request-with-user.interface';

// Ce décorateur permet d'injecter l'utilisateur connecté directement dans les paramètres du contrôleur
// Ex: @Get() myProfile(@CurrentUser() user: User)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
