// Importing the `z` object and `ZodType` type from the Zod library.
// Zod is used for schema validation in JavaScript and TypeScript.
import { z, ZodType } from 'zod';

// This class contains validation rules for the Contact data structure.
export class ContactValidation {
  // Defining a static constant `CREATE` to validate the input data for creating a contact.
  // The `CREATE` schema ensures that input data matches the required structure and constraints.
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(1).max(100), // Validates `first_name` as a required string with a length between 1 and 100 characters.
    last_name: z.string().min(1).max(100).optional(), // Validates `last_name` as an optional string with a maximum length of 100 characters.
    email: z.string().min(1).max(100).email().optional(), // Validates `email` as an optional string with email format and a maximum length of 100 characters.
    phone: z.string().min(1).max(20).optional(), // Validates `phone` as an optional string with a maximum length of 20 characters.
  });

  // Static constant `UPDATE` defines the schema for validating data when updating an existing contact.
  // The schema includes an `id` field and allows optional updates to other fields.
  static readonly UPDATE: ZodType = z.object({
    // Validates `id` as a required positive number.
    id: z.number().positive(),

    // Validates `first_name` as a required string with a minimum length of 1 and a maximum of 100 characters.
    first_name: z.string().min(1).max(100),

    // Validates `last_name` as an optional string with a maximum length of 100 characters.
    last_name: z.string().min(1).max(100).optional(),

    // Validates `email` as an optional string that must be in email format and have a maximum length of 100 characters.
    email: z.string().min(1).max(100).email().optional(),

    // Validates `phone` as an optional string with a maximum length of 20 characters.
    phone: z.string().min(1).max(20).optional(),
  });
}
