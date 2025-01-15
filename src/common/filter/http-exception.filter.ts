import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CustomException } from '../custom-exception/base.exception';

@Catch(CustomException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.statusCode;
    const message = exception.message;

    response.status(status).json({ statusCode: status, message });
  }
}
