// Importing necessary decorators and modules from NestJS.
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
// `Body` is used to extract the body of a request.
// `Controller` is used to define the controller class.
// `HttpCode` is used to set the HTTP status code for a route.
// `Post` is used to handle HTTP POST requests.

import { UserService } from './user.service'; // Importing the UserService to handle user-related business logic.
import { WebResponse } from '../model/web.model'; // Importing WebResponse, a generic response model for consistent API responses.
import {
  LoginUserRequest, // Model defining the structure of the login request.
  RegisterUserRequest, // Model defining the structure of the registration request.
  UserRespone, // Model defining the structure of the response containing user data.
} from '../model/user.model';
import { Auth } from '../common/auth.decorator'; // Custom decorator for extracting authenticated user information.
import { User } from '@prisma/client'; // Prisma's User model representing the database entity.

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

  // Defining an HTTP POST endpoint for user login.
  @Post('/login') // Maps HTTP POST requests to the `/login` endpoint.
  @HttpCode(200) // Sets the HTTP status code to 200 (OK) for successful responses.

  // Handles user login requests.
  async login(
    @Body() request: LoginUserRequest, // Extracts the request body and maps it to the `LoginUserRequest` structure.
  ): Promise<WebResponse<UserRespone>> {
    // Calls the `login` method from the `UserService` to handle the login process.
    const result = await this.userService.login(request);

    // Wraps the result in a `WebResponse` object and returns it.
    return {
      data: result, // Contains the user data after successful login, including the generated token.
    };
  }

  // Route to get the details of the currently authenticated user.
  @Get('/current') // Maps HTTP GET requests to the `/current` endpoint.
  @HttpCode(200) // Specifies the HTTP status code for a successful response.

  // Retrieves the details of the authenticated user.
  async get(@Auth() user: User): Promise<WebResponse<UserRespone>> {
    // Calls the UserService's `get` method to retrieve user details.
    const result = await this.userService.get(user);

    // Wraps the result in a WebResponse object and returns it.
    return {
      data: result, // Contains the authenticated user's details.
    };
  }
}
