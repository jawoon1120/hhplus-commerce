import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as winston from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new winston.transports.File({ filename: 'service.log' })],
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.info({
            type: 'Request Completed',
            method,
            url,
            body,
            query,
            params,
            response: data,
            duration: `${Date.now() - now}ms`,
          });
        },
        error: (error) => {
          this.logger.error({
            type: 'Request Failed',
            method,
            url,
            body,
            query,
            params,
            error: {
              message: error.message,
              stack: error.stack,
            },
            duration: `${Date.now() - now}ms`,
          });
        },
      }),
    );
  }
}
