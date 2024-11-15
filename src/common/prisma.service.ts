// Importing necessary modules and decorators from NestJS and external libraries.
import { Logger } from 'winston'; // Importing the Winston Logger for logging events.
import { PrismaClient, Prisma } from '@prisma/client'; // Importing PrismaClient and types for interacting with the database.
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'; // Importing decorators and interfaces from NestJS.
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; // Importing the provider for Winston logger from nest-winston.

// The PrismaService class extends PrismaClient and implements OnModuleInit interface
// to manage database interactions and handle logging using Winston.
@Injectable() // Extending PrismaClient to include custom logging behavior.
// Implementing the OnModuleInit interface to run logic during module initialization.
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  // Constructor that injects the Winston logger for logging database events.
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // Injecting the Winston logger service.
  ) {
    // Calling the super constructor to configure PrismaClient with custom logging settings.
    super({
      log: [
        {
          emit: 'event', // Emit logs as events for specific log levels.
          level: 'info', // Set the log level to 'info' for general information.
        },
        {
          emit: 'event', // Emit logs as events for warnings.
          level: 'warn', // Set the log level to 'warn' for warnings.
        },
        {
          emit: 'event', // Emit logs as events for errors.
          level: 'error', // Set the log level to 'error' for errors.
        },
        {
          emit: 'event', // Emit logs as events for database queries.
          level: 'query', // Set the log level to 'query' for database queries.
        },
      ],
    });
  }

  // `onModuleInit` is called when the module is initialized.
  // This method sets up event listeners to log Prisma events using Winston.
  onModuleInit() {
    // Event listener for 'info' logs from Prisma, which logs informational messages.
    this.$on('info', (e) => {
      this.logger.info(e); // Log the 'info' event using Winston logger.
    });

    // Event listener for 'warn' logs from Prisma, which logs warnings.
    this.$on('warn', (e) => {
      this.logger.warn(e); // Log the 'warn' event using Winston logger.
    });

    // Event listener for 'error' logs from Prisma, which logs errors.
    this.$on('error', (e) => {
      this.logger.error(e); // Log the 'error' event using Winston logger.
    });

    // Event listener for 'query' logs from Prisma, which logs database queries.
    this.$on('query', (e) => {
      this.logger.info(e); // Log the 'query' event using Winston logger.
    });
  }
}
