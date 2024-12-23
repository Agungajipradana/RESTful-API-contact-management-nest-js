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
      await testService.deleteUser(); // Clears the user data for a clean test environment.
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

  // Nested test suite for the `POST /api/users/login` endpoint.
  describe('POST /api/users/login', () => {
    // Prepare test data: Clear users and create a test user before each test.
    beforeEach(async () => {
      await testService.deleteUser(); // Clears existing user data.
      await testService.createUser(); // Creates a test user for login scenarios.
    });

    // Test case: Invalid login requests should be rejected.
    it('should be rejected if request is invalid', async () => {
      // Send an HTTP POST request with invalid data for user login.
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '', // Invalid username.
          password: '', // Invalid password.
        });

      // Log the response body for debugging purposes.
      logger.info(response.body);

      // Expect the response status to be 400 (Bad Request).
      expect(response.status).toBe(400);

      // Expect the response to contain validation errors.
      expect(response.body.errors).toBeDefined();
    });

    // Test case: Valid login requests should succeed.
    it('should be able to login', async () => {
      // Send an HTTP POST request with valid login credentials.
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test', // Valid username.
          password: 'test', // Valid password.
        });

      // Log the response body for debugging purposes.
      logger.info(response.body);

      // Expect the response status to be 200 (OK).
      expect(response.status).toBe(200);

      // Expect the response data to match the logged-in user information and contain a token.
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined(); // Ensure a token is returned.
    });
  });

  // Describe block for testing the GET /api/users/current endpoint.
  describe('GET /api/users/current', () => {
    // beforeEach block that runs before each test case.
    // It prepares the test environment by deleting and creating a user.
    beforeEach(async () => {
      // Deleting any existing user with username 'test' before each test.
      await testService.deleteUser();
      // Creating a new user with username 'test' before each test.
      await testService.createUser();
    });

    // Test case to check if the request is rejected when the token is invalid.
    it('should be rejected if token is invalid', async () => {
      // Sending a GET request to the /api/users/current endpoint with an invalid token.
      const response = await request(app.getHttpServer())
        .get('/api/users/current') // The route being tested.
        .set('Authorization', 'wrong'); // Setting the invalid token in the Authorization header.

      // Logging the response body for debugging purposes.
      logger.info(response.body);

      // Asserting that the response status code should be 401 (Unauthorized).
      expect(response.status).toBe(401);

      // Asserting that the response body contains an 'errors' field.
      expect(response.body.errors).toBeDefined();
    });

    // Test case to check if the request is successful and returns the user data.
    it('should be able to get user', async () => {
      // Sending a GET request to the /api/users/current endpoint with a valid token.
      const response = await request(app.getHttpServer())
        .get('/api/users/current') // The route being tested.
        .set('Authorization', 'test'); // Setting the valid token 'test' in the Authorization header.

      // Logging the response body for debugging purposes.
      logger.info(response.body);

      // Asserting that the response status code should be 200 (OK).
      expect(response.status).toBe(200);

      // Asserting that the response body contains the expected user data.
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });

  // Describes the test suite for the PATCH /api/users/current endpoint.
  describe('PATCH /api/users/current', () => {
    // Runs before each test to ensure a clean environment by deleting and recreating a test user.
    beforeEach(async () => {
      await testService.deleteUser(); // Deletes any existing test user.
      await testService.createUser(); // Creates a new test user for testing.
    });

    // Test case: Verifies that an invalid request is rejected.
    it('should be rejected if request is invalid', async () => {
      // Sends a PATCH request with an invalid payload (empty strings for `password` and `name`).
      const response = await request(app.getHttpServer())
        .patch('/api/users/current') // Specifies the endpoint to test.
        .set('Authorization', 'test') // Sets the authorization header for authentication.
        .send({
          password: '', // Invalid: Empty string for password.
          name: '', // Invalid: Empty string for name.
        });

      // Logs the response body for debugging purposes.
      logger.info(response.body);

      // Asserts that the HTTP status code is 400 (Bad Request).
      expect(response.status).toBe(400);

      // Asserts that the response contains validation error details.
      expect(response.body.errors).toBeDefined();
    });

    // Test case: Verifies that the name can be successfully updated.
    it('should be able to update name', async () => {
      // Sends a PATCH request with a valid payload to update the user's name.
      const response = await request(app.getHttpServer())
        .patch('/api/users/current') // Specifies the endpoint to test.
        .set('Authorization', 'test') // Sets the authorization header for authentication.
        .send({
          name: 'test updated', // Valid: Updates the name field.
        });

      // Logs the response body for debugging purposes.
      logger.info(response.body);

      // Asserts that the HTTP status code is 200 (OK).
      expect(response.status).toBe(200);

      // Asserts that the username remains unchanged in the response.
      expect(response.body.data.username).toBe('test');

      // Asserts that the name is updated correctly in the response.
      expect(response.body.data.name).toBe('test updated');
    });

    // Test case: Verifies that the password can be successfully updated.
    it('should be able to update password', async () => {
      // Sends a PATCH request with a valid payload to update the user's password.
      let response = await request(app.getHttpServer())
        .patch('/api/users/current') // Specifies the endpoint to test.
        .set('Authorization', 'test') // Sets the authorization header for authentication.
        .send({
          password: 'updated', // Valid: Updates the password field.
        });

      // Logs the response body for debugging purposes.
      logger.info(response.body);

      // Asserts that the HTTP status code is 200 (OK).
      expect(response.status).toBe(200);

      // Asserts that the username remains unchanged in the response.
      expect(response.body.data.username).toBe('test');

      // Asserts that the name remains unchanged in the response.
      expect(response.body.data.name).toBe('test');

      // Sends a POST request to login with the updated password.
      response = await request(app.getHttpServer())
        .post('/api/users/login') // Specifies the login endpoint.
        .send({
          username: 'test', // Uses the test user's username.
          password: 'updated', // Uses the updated password for login.
        });

      // Logs the response body for debugging purposes.
      logger.info(response.body);

      // Asserts that the HTTP status code is 200 (OK).
      expect(response.status).toBe(200);

      // Asserts that a token is included in the response, indicating successful login.
      expect(response.body.data.token).toBeDefined();
    });
  });

  // Test suite for DELETE endpoint `/api/users/current`.
  describe('DELETE /api/users/current', () => {
    // Before each test, delete any existing test user and create a fresh test user.
    beforeEach(async () => {
      await testService.deleteUser(); // Deletes any user with the username 'test' from the database.
      await testService.createUser(); // Creates a new user with predefined test data.
    });

    // Test case: Invalid token should reject the request.
    it('should be rejected if token is invalid', async () => {
      // Send a DELETE request with an invalid token.
      const response = await request(app.getHttpServer())
        .delete('/api/users/current') // Target the DELETE endpoint.
        .set('Authorization', 'wrong'); // Set an invalid token in the Authorization header.

      logger.info(response.body); // Log the response body for debugging purposes.

      // Assert that the response status code is 401 (Unauthorized).
      expect(response.status).toBe(401);

      // Assert that the response body contains errors.
      expect(response.body.errors).toBeDefined();
    });

    // Test case: Valid token should allow user logout.
    it('should be able to logout user', async () => {
      // Send a DELETE request with a valid token.
      const response = await request(app.getHttpServer())
        .delete('/api/users/current') // Target the DELETE endpoint.
        .set('Authorization', 'test'); // Set a valid token in the Authorization header.

      logger.info(response.body); // Log the response body for debugging purposes.

      // Assert that the response status code is 200 (OK).
      expect(response.status).toBe(200);

      // Assert that the response body contains `data: true`, indicating successful logout.
      expect(response.body.data).toBe(true);

      // Retrieve the user data from the database to verify logout.
      const user = await testService.getUser();

      // Assert that the user's token in the database is null, confirming the logout process.
      expect(user.token).toBeNull();
    });
  });
});
