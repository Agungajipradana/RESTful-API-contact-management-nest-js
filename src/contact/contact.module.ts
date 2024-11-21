import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

/**
 * The @Module decorator marks this class as a module in NestJS.
 * A module is a logical grouping of components, services, and controllers
 * that make up a specific feature or functionality in the application.
 */
@Module({
  // The 'providers' array lists services that can be injected into other components.
  providers: [ContactService], // Provides the ContactService to the module.

  // The 'controllers' array lists the controllers that handle incoming requests.
  controllers: [ContactController], // Manages HTTP requests for contacts.
})
export class ContactModule {} // Exports the ContactModule so it can be used in the application.
