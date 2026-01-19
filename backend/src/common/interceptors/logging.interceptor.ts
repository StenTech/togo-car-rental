import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = ctx.getResponse<Response>();
        const delay = Date.now() - now;

        // Structure de log "Elite" : Objet JSON pur pour faciliter l'ingestion (ELK/Datadog)
        this.logger.log({
          message: `HTTP Request ${method} ${url}`,
          method,
          url,
          statusCode: response.statusCode,
          durationMs: delay,
          ip,
          userAgent,
        });
      }),
    );
  }
}
