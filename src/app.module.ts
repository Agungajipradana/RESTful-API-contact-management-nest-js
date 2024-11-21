// Importing necessary decorators and modules from NestJS.
import { Module } from '@nestjs/common'; // The `Module` decorator is used to define a module in NestJS.
import { CommonModule } from './common/common.module'; // Importing the CommonModule, which contains shared configurations and services.
import { UserModule } from './user/user.module'; // Importing the UserModule, which manages user-related functionality.
import { ContactModule } from './contact/contact.module'; // Importing the ContactModule, which handles contact-related functionality.

// Defining the main application module using the `@Module` decorator.
@Module({
  // The `imports` array lists the modules that this module depends on.
  imports: [
    CommonModule, // CommonModule provides shared utilities like logging, validation, and Prisma services.
    UserModule, // UserModule handles user-related operations such as registration and management.
    ContactModule, // ContactModule manages contact-related features like storing and accessing contact data.
  ],

  // The `controllers` array defines the controllers available in this module.
  // In this case, the AppModule does not define any controllers directly.
  controllers: [],

  // The `providers` array lists the services available in this module for dependency injection.
  // AppModule does not define any specific providers here as it relies on imported modules.
  providers: [],
})
// This class defines the AppModule, which serves as the root module of the NestJS application.
// It aggregates other modules, such as CommonModule, UserModule, and ContactModule,
// to compose the application's functionality and structure.
export class AppModule {}
