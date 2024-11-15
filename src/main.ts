// Import the NestFactory, which is used to create the main NestJS application instance.
import { NestFactory } from '@nestjs/core';

// Import the root module of the application.
import { AppModule } from './app.module';

// Import the constant for Winston logger integration with NestJS.
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// Define an asynchronous function `bootstrap` to initialize the application.
async function bootstrap() {
  // Create the main application instance using the `AppModule`.
  const app = await NestFactory.create(AppModule);

  // Retrieve the Winston logger instance from the application's dependency injection container.
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  // Configure the application to use the retrieved Winston logger for logging.
  app.useLogger(logger);

  // Start the application and listen on port 3000.
  await app.listen(3000);
}

// Call the `bootstrap` function to start the application.
bootstrap();
