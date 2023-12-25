import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { paths } from '../constants/paths';

interface ExtendedHttpExceptionResponse {
  message?: string;
  error?: any;
  success?: boolean;
}

@Catch(HttpException)
class ExceptionFilters implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: ExtendedHttpExceptionResponse | string =
      exception.getResponse();

    let responseMessage = '';
    let isCustomMessage = false;

    if (request.url.includes(paths.sign_up) && status === 403) {
      responseMessage = 'Credentials taken';
      isCustomMessage = true;
    } else if (request.url.includes(paths.sign_in)) {
    }

    if (!isCustomMessage) {
      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        responseMessage = exceptionResponse.message;
      } else if (typeof exceptionResponse === 'string') {
        responseMessage = exceptionResponse;
      }
    }

    const jsonResponse: ExtendedHttpExceptionResponse = {};

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      if ('error' in exceptionResponse) {
        (jsonResponse.success = false),
          (jsonResponse.error = {
            ...exceptionResponse,
            message: isCustomMessage
              ? responseMessage
              : exceptionResponse.message,
          });
      } else {
        jsonResponse.message = isCustomMessage
          ? responseMessage
          : exceptionResponse.message;
      }
    } else if (typeof exceptionResponse === 'string') {
      jsonResponse.message = isCustomMessage
        ? responseMessage
        : exceptionResponse;
    }

    response.status(status).json(jsonResponse);
  }
}

export default ExceptionFilters;
