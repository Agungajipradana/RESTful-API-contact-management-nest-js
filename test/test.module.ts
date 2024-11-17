// Importing necessary decorators and modules from NestJS.
import { Module } from '@nestjs/common'; // `Module` decorator for defining NestJS modules.
import { TestService } from './test.service'; // Importing the `TestService` to be provided by this module.

@Module({
  // The `providers` array defines the services that will be instantiated and available for dependency injection.
  providers: [TestService],
})
// This class defines the `TestModule`, which encapsulates the `TestService` for use in other parts of the application.
export class TestModule {}
