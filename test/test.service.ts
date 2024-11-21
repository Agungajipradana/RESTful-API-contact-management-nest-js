// Importing necessary decorators and modules from NestJS and third-party libraries.
import { Injectable } from '@nestjs/common'; // `Injectable` decorator marks the class as a service that can be injected.
import * as bcrypt from 'bcrypt'; // Importing bcrypt for password hashing.
import { PrismaService } from '../src/common/prisma.service'; // Importing PrismaService for database operations.
import { User } from '@prisma/client'; // Prisma's User model representing the database entity.

// The `TestService` is responsible for performing test-specific operations like user creation and deletion.
@Injectable()
export class TestService {
  // Injecting the PrismaService into the constructor for interacting with the database.
  constructor(private prismaService: PrismaService) {}

  // Method to delete any user with the username 'test' from the database.
  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test', // Specifies the condition for deleting users.
      },
    });
  }

  // Deletes all contacts associated with the username 'test'.
  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test', // Specifies the condition: delete contacts associated with 'test'.
      },
    });
  }

  // Method to retrieve a user with the username 'test' from the database.
  async getUser(): Promise<User> {
    // Finds a unique user record in the database based on the provided condition.
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test', // Specifies the condition for retrieving the user.
      },
    });
  }

  // Method to create a new user with the username 'test' and a hashed password.
  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test', // The username for the new user.
        name: 'test', // The name for the new user.
        // Using bcrypt to hash the password before saving it to the database.
        password: await bcrypt.hash('test', 10), // Hashing the password 'test' with a salt rounds of 10.
        token: 'test', // Setting a test token for the user.
      },
    });
  }
}
