// Importing necessary functions and types from Zod library for schema validation.
import { z, ZodType } from 'zod'; // `z` is the Zod validation utility, and `ZodType` is the type for defining schemas.

export class UserValidation {
  // Static property that holds the validation schema for user registration.
  static readonly REGISTER: ZodType = z.object({
    // Validation for the 'username' field: must be a string between 1 and 100 characters.
    username: z.string().min(1).max(100),

    // Validation for the 'password' field: must be a string between 1 and 100 characters.
    password: z.string().min(1).max(100),

    // Validation for the 'name' field: must be a string between 1 and 100 characters.
    name: z.string().min(1).max(100),
  });

  // Static property that holds the validation schema for user login.
  static readonly LOGIN: ZodType = z.object({
    // Validation for the 'username' field: must be a string between 1 and 100 characters.
    username: z.string().min(1).max(100),

    // Validation for the 'password' field: must be a string between 1 and 100 characters.
    password: z.string().min(1).max(100),
  });

  // Static property that holds the validation schema for updating user data.
  static readonly UPDATE: ZodType = z.object({
    // Validation for the 'name' field: optional field that, if provided, must be a string between 1 and 100 characters.
    name: z.string().min(1).max(100).optional(),

    // Validation for the 'password' field: optional field that, if provided, must be a string between 1 and 100 characters.
    password: z.string().min(1).max(100).optional(),
  });
}
