// Importing required modules and decorators from NestJS.
import { Injectable, NestMiddleware } from '@nestjs/common';
// `Injectable` marks the class as a provider that can be injected into other classes.
// `NestMiddleware` is an interface for creating custom middleware in NestJS.

import { PrismaService } from './prisma.service';
// `PrismaService` is a service used for interacting with the database.

// Defining the `AuthMiddleware` class as a middleware and making it injectable.
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  // Injecting the PrismaService via the constructor to access database operations.
  constructor(private prismaService: PrismaService) {}

  // Middleware logic to handle incoming requests.
  async use(req: any, res: any, next: (error?: Error | any) => void) {
    // Extract the `authorization` token from the request headers.
    const token = req.headers['authorization'] as string;

    // If a token is present in the headers, validate it.
    if (token) {
      // Search for a user in the database with a matching token.
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token, // Token-based lookup.
        },
      });

      // If a user is found, attach the user information to the request object.
      if (user) {
        req.user = user; // Adds user details to the request for further use in the application.
      }
    }

    // Call the `next` function to pass control to the next middleware or route handler.
    next();
  }
}
