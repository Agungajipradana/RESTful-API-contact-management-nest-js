// Importing the necessary decorator from NestJS and the ZodType class from Zod for validation.
import { Injectable } from '@nestjs/common'; // `Injectable` decorator makes the class injectable as a service.
import { ZodType } from 'zod'; // Importing ZodType from Zod library, which is used for schema validation.

// The ValidationService class is a service that handles data validation using Zod schemas.
@Injectable()
export class ValidationService {
  // The `validate` method takes a Zod schema (ZodType) and some data to validate.
  // It returns the validated data if it conforms to the schema, or throws an error if validation fails.
  validate<T>(zodType: ZodType<T>, data: T): T {
    return zodType.parse(data); // Calling the `parse` method on the Zod schema to validate the data.
  }
}
