// Importing necessary decorators and modules from NestJS.
import {
  createParamDecorator, // Used to create custom parameter decorators in NestJS.
  ExecutionContext, // Provides execution context for the current request.
  HttpException, // Represents an HTTP exception for error handling.
} from '@nestjs/common';

// Defining a custom parameter decorator named `Auth`.
// This decorator retrieves the authenticated user from the request object or throws an error if the user is not authenticated.
export const Auth = createParamDecorator(
  (
    data: unknown, // Optional metadata passed when the decorator is applied. Not used in this implementation.
    context: ExecutionContext, // Provides details about the current request execution context.
  ) => {
    // Extracting the request object from the execution context.
    const request = context.switchToHttp().getRequest();

    // Retrieving the `user` property, which is typically set by authentication middleware.
    const user = request.user;

    // If the `user` is found, it is returned.
    if (user) {
      return user;
    } else {
      // If no `user` is found, an HTTP exception with a 401 Unauthorized status is thrown.
      throw new HttpException('Unauthorized', 401);
    }
  },
);
