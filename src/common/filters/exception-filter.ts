import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { paths } from '../constants/paths';
import { I18nService } from 'nestjs-i18n';

interface ExtendedHttpExceptionResponse {
  message?: string;
  error?: any;
  success?: boolean;
}

@Catch(HttpException)
class ExceptionFilters implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: ExtendedHttpExceptionResponse | string =
      exception.getResponse();

    let responseMessage = '';
    let isCustomMessage = false;

    if (request.url.includes(paths.sign_up) && status === 403) {
      responseMessage = await this.i18n.t('lang.credentials_taken');
      isCustomMessage = true;
    } else if (
      request.url.includes(paths.sign_in) &&
      (status === 401 || status === 403)
    ) {
      responseMessage = await this.i18n.t('lang.credentials_wrong');
      isCustomMessage = true;
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
