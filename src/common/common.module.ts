// Importing necessary decorators and modules from NestJS and Winston libraries.
import { Global, Module } from '@nestjs/common'; // `Global` and `Module` decorators for defining modules.
import { ConfigModule } from '@nestjs/config'; // ConfigModule to manage environment variables.
import { WinstonModule } from 'nest-winston'; // Winston module for integrating logging in NestJS.
import * as winston from 'winston'; // Winston library for customizable logging.
import { PrismaService } from './prisma.service'; // Custom service for database interactions using Prisma.
import { ValidationService } from './validation.service'; // Custom service for data validation using Zod.
import { APP_FILTER } from '@nestjs/core'; // NestJS constant to define global exception filters.
import { ErrorFilter } from './error.filter'; // Custom error filter for handling and formatting exceptions.

// The `@Global` decorator makes this module available globally in the application.
// Once imported, its services can be used without re-importing it in other modules.
@Global()
@Module({
  // The `imports` array defines the modules required by this module.
  imports: [
    // Configuring Winston as the logging service for the application.
    WinstonModule.forRoot({
      // Setting the logging format to JSON for structured logs.
      format: winston.format.json(),
      // Specifying the transport mechanism for logging, here it's the console.
      transports: [new winston.transports.Console()],
    }),
    // ConfigModule is used for loading environment variables and configuration files.
    // Setting `isGlobal: true` makes this configuration available globally across the app.
    ConfigModule.forRoot({
      isGlobal: true, // Makes configuration globally accessible without needing to import the module elsewhere.
    }),
  ],
  // The `providers` array registers services that will be available for dependency injection in other parts of the app.
  providers: [
    PrismaService, // Service for database operations using Prisma ORM.
    ValidationService, // Service for validating data models using Zod.
    {
      provide: APP_FILTER, // Setting a global exception filter for the app.
      useClass: ErrorFilter, // Using the custom ErrorFilter to handle exceptions.
    },
  ],
  // The `exports` array allows services to be shared with other modules that import `CommonModule`.
  exports: [PrismaService, ValidationService], // Exporting PrismaService and ValidationService for use in other modules.
})
// This class defines the CommonModule, which serves as a centralized module
// for common configurations or services, like logging in this case.
export class CommonModule {}
