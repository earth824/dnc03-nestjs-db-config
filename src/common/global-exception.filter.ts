import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    // HTTP Server (Express.js)
    // res.status(400).json({ message: 'Error' })
    const res = host.switchToHttp().getResponse<Response>();

    // BadRequest, Unauthorized, Forbidden, Notfound => inherit => HttpException
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const obj = exception.getResponse(); // new BadRequestException({ a: 20 })
      let message;
      if (typeof obj === 'object' && 'message' in obj) {
        message = obj.message;
      } else {
        message = obj;
      }
      res.status(statusCode).json({ message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
