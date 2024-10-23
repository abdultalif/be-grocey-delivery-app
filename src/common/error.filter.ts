import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodError } from 'zod';
@Catch(ZodError)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof ZodError) {
      const formattedErrors = exception.errors.reduce(
        (acc, curr) => {
          const { path, message } = curr;
          const field = path[0];
          acc[field] = acc[field] ? [...acc[field], message] : [message];
          return acc;
        },
        {} as Record<string, string[]>,
      );

      response.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: formattedErrors,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: exception.message,
      });
    }
  }
}
