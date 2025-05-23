import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException as NestRpcException, RpcException } from '@nestjs/microservices';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // For HTTP Requests
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    console.log("exception:", exception);
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      response.status(status).json({
        statusCode: status,
        status: false,
        ...(typeof res === 'string' ? { message: res } : res),
      });
    }
    // For RPC/Microservice exceptions (like Redis transport)
    else if (exception instanceof NestRpcException) {
      // You can customize how to handle microservice exceptions here
      // Example: just rethrow it or transform
      throw exception;
    }
    else if (exception?.status == HttpStatus.BAD_REQUEST) {
      response.status(exception.cause).json({
        statusCode: exception.cause,
        status: false,
        message: exception.message,
        data: {}
      });
    }
    else {
      // Fallback - internal server error
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        status: false,
        message: 'Internal server error'
      });
    }
  }
}
