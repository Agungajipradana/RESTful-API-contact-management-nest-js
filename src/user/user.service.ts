// Importing necessary modules and services.
import { HttpException, Inject, Injectable } from '@nestjs/common'; // NestJS decorators and classes.
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; // Winston module for logging.
import { PrismaService } from '../common/prisma.service'; // Prisma service for database interaction.
import { ValidationService } from '../common/validation.service'; // Validation service for data validation.
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserRespone,
} from '../model/user.model'; // Models for user data.
import { Logger } from 'winston'; // Winston logger for logging events.
import { UserValidation } from './user.validation'; // User validation schema.
import * as bcrypt from 'bcrypt'; // bcrypt for password hashing.
import { v4 as uuid } from 'uuid'; // Library for generating unique tokens.
import { User } from '@prisma/client'; // Prisma's User model type.

@Injectable() // Marks this class as injectable in the NestJS context.
export class UserService {
  // Injecting required services: ValidationService, Logger, PrismaService.
  constructor(
    private validationService: ValidationService, // Service for validating data.
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger, // Injecting the logger.
    private prismaService: PrismaService, // Prisma service for interacting with the database.
  ) {}

  // Method to register a new user.
  async register(request: RegisterUserRequest): Promise<UserRespone> {
    // Log the incoming request to register a new user.
    this.logger.info(`Register new user ${JSON.stringify(request)}`);

    // Validate the incoming request using predefined validation schema.
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    // Check if the username already exists in the database.
    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    // If username exists, throw an HTTP exception with a 400 status.
    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }

    // Hash the user's password before storing it in the database.
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    // Create a new user record in the database.
    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    // Return the response containing the user's username and name.
    return {
      username: user.username,
      name: user.name,
    };
  }

  // Method to handle user login.
  async login(request: LoginUserRequest): Promise<UserRespone> {
    // Log the incoming login request.
    this.logger.info(`UserService.login(${JSON.stringify(request)})`);

    // Validate the login request using the validation schema.
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    // Attempt to find a user with the provided username in the database.
    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    // If the user does not exist, throw an HTTP exception with a 401 status code.
    if (!user) {
      throw new HttpException('Username or password is invalid', 401);
    }

    // Compare the provided password with the stored hashed password.
    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    // If the password is invalid, throw an HTTP exception with a 401 status code.
    if (!isPasswordValid) {
      throw new HttpException('Username or password is invalid', 401);
    }

    // Generate a new token for the user and update their record in the database.
    user = await this.prismaService.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(), // Generate a unique token using UUID.
      },
    });

    // Return the user's username, name, and the newly generated token.
    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  // Method to retrieve user details.
  async get(user: User): Promise<UserRespone> {
    // Returning the user's username and name as a response.
    return {
      username: user.username,
      name: user.name,
    };
  }
}
