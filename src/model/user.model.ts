// Class to represent the structure of a request when registering a new user.
export class RegisterUserRequest {
  // The username provided by the user during registration.
  username: string;

  // The password provided by the user during registration.
  password: string;

  // The full name provided by the user during registration.
  name: string;
}

// Class to represent the structure of the response for a user.
export class UserRespone {
  // The username of the user.
  username: string;

  // The full name of the user.
  name: string;

  // Optionally, a token that might be provided after successful user registration or login.
  token?: string;
}
