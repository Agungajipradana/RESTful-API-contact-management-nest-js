// Importing necessary decorators and modules from NestJS and Zod library for error handling.
import {
  ArgumentsHost, // ArgumentsHost allows access to the request and response objects.
  Catch, // Catch decorator marks this class as a handler for specific exceptions.
  ExceptionFilter, // ExceptionFilter interface to handle exceptions in NestJS.
  HttpException, // HttpException class for HTTP errors in NestJS.
} from '@nestjs/common';
import { ZodError } from 'zod'; // Importing ZodError for handling validation errors from Zod.

// The `@Catch` decorator defines the types of exceptions that this filter will handle.
// It will catch both ZodError and HttpException.
@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  // The `catch` method processes the caught exception and customizes the response.
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse(); // Get the response object from the host.

    // If the exception is an instance of HttpException, handle it accordingly.
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(), // Return the response defined in the HttpException.
      });
    }
    // If the exception is an instance of ZodError, return a 400 status and a validation error message.
    else if (exception instanceof ZodError) {
      response.status(400).json({
        errors: 'Validation error', // Return a generic validation error message.
      });
    }
    // For any other unhandled exceptions, return a 500 status with the exception's message.
    else {
      response.status(500).json({
        errors: exception.message, // Return the exception message.
      });
    }
  }
}
