// Importing necessary decorators and modules from NestJS.
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
// `Body` is used to extract the body of a request.
// `Controller` is used to define the controller class.
// `HttpCode` is used to set the HTTP status code for a route.
// `Post` is used to handle HTTP POST requests.

import { UserService } from './user.service'; // Importing the UserService to handle user-related business logic.
import { WebResponse } from '../model/web.model'; // Importing WebResponse, a generic response model for consistent API responses.
import { RegisterUserRequest, UserRespone } from '../model/user.model';
// `RegisterUserRequest` defines the structure of the registration request.
// `UserRespone` defines the structure of the response for user data.

// Defining the UserController and associating it with the `/api/users` route prefix.
@Controller('/api/users')
export class UserController {
  // Injecting the UserService into the controller via the constructor.
  constructor(private userService: UserService) {}

  // Defining a POST route for user registration.
  // The `@Post()` decorator maps HTTP POST requests to this method.
  @Post()

  // Setting the HTTP response code to 200 (OK).
  @HttpCode(200)

  // This method handles user registration requests.
  // The `@Body()` decorator extracts the request body and maps it to `RegisterUserRequest`.
  // It returns a promise of `WebResponse<UserRespone>`, which includes the registration result.
  async register(
    @Body() request: RegisterUserRequest, // The user registration data extracted from the request body.
  ): Promise<WebResponse<UserRespone>> {
    // Calls the `register` method from the UserService to handle the registration logic.
    const result = await this.userService.register(request);

    // Returns the result wrapped in a WebResponse object.
    return {
      data: result, // The registration result, including user details.
    };
  }
}
