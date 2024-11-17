// Importing necessary decorators and modules from NestJS.
import { Module } from '@nestjs/common'; // The `Module` decorator is used to define a module in NestJS.
import { UserService } from './user.service'; // Importing the UserService, which contains the business logic for user-related operations.
import { UserController } from './user.controller'; // Importing the UserController, which handles HTTP requests and responses for user-related endpoints.

@Module({
  // The `providers` array registers services or providers that are injectable and can be used within the module.
  providers: [UserService], // Registering UserService to handle user-related business logic.

  // The `controllers` array registers controllers that define the endpoints for this module.
  controllers: [UserController], // Registering UserController to handle HTTP requests for user endpoints.
})
// Defining the `UserModule`, which serves as a module for user-related functionality in the application.
export class UserModule {}
