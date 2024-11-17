// Importing necessary modules for testing NestJS applications.
import { Test, TestingModule } from '@nestjs/testing'; // Provides utilities to create and manage testing modules.
import { INestApplication } from '@nestjs/common'; // Interface for NestJS application instance.
import * as request from 'supertest'; // Library for testing HTTP requests.
import { AppModule } from '../src/app.module'; // The main application module.
import { Logger } from 'winston'; // Winston logger for logging during tests.
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; // Token to access the Winston logger in NestJS.
import { TestService } from './test.service'; // Service used to manage test-related operations.
import { TestModule } from './test.module'; // Module containing test-related dependencies.

// The test suite for `UserController`.
describe('UserController', () => {
  let app: INestApplication; // Reference to the NestJS application instance.
  let logger: Logger; // Logger instance to log information during tests.
  let testService: TestService; // Service instance for managing test data.

  // `beforeEach` block sets up the application and dependencies before each test.
  beforeEach(async () => {
    // Creates a testing module with the application's main and test-specific modules.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule], // Import application and test-specific modules.
    }).compile();

    // Initializes the NestJS application.
    app = moduleFixture.createNestApplication();
    await app.init();

    // Retrieves the logger and test service instances from the application.
    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  // Nested test suite for the `POST /api/users` endpoint.
  describe('POST /api/users', () => {
    // Deletes all users in the database before each test.
    beforeEach(async () => {
      testService.deleteUser(); // Clears the user data for a clean test environment.
    });

    // Test case: Should reject invalid user registration requests.
    it('should be rejected if request is invalid', async () => {
      // Sends an HTTP POST request with invalid user data.
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      // Logs the response body for debugging purposes.
      logger.info(response.body);

      // Asserts that the response status code is 400 (Bad Request).
      expect(response.status).toBe(400);

      // Asserts that the response body contains validation errors.
      expect(response.body.errors).toBeDefined();
    });

    // Test case: Should allow valid user registration.
    it('should be able to register', async () => {
      // Sends an HTTP POST request with valid user data.
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      // Logs the response body for debugging purposes.
      logger.info(response.body);

      // Asserts that the response status code is 200 (OK).
      expect(response.status).toBe(200);

      // Asserts that the registered user's data matches the request.
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });

    // Test case: Should reject registration if the username already exists.
    it('should be rejected if username already exists', async () => {
      // Creates a user with the same username to simulate a conflict.
      await testService.createUser();

      // Sends an HTTP POST request with duplicate user data.
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      // Logs the response body for debugging purposes.
      logger.info(response.body);

      // Asserts that the response status code is 400 (Bad Request).
      expect(response.status).toBe(400);

      // Asserts that the response body contains validation errors for the conflict.
      expect(response.body.errors).toBeDefined();
    });
  });
});
