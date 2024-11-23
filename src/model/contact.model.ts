// The `ContactResponse` class represents the data structure for a contact's response.
// It is used when sending contact information back to the client.
export class ContactResponse {
  id: number; // Unique identifier for the contact.
  first_name: string; // The first name of the contact.
  last_name?: string; // (Optional) The last name of the contact.
  email?: string; // (Optional) The email address of the contact.
  phone?: string; // (Optional) The phone number of the contact.
}

// The `CreateContactRequest` class represents the structure for creating a new contact.
// It is used to validate and process incoming data when creating a contact.
export class CreateContactRequest {
  first_name: string; // The first name of the contact (required field).
  last_name?: string; // (Optional) The last name of the contact.
  email?: string; // (Optional) The email address of the contact.
  phone?: string; // (Optional) The phone number of the contact.
}

export class UpdateContactRequest {
  // The unique identifier for the contact to be updated.
  id: number;

  // The first name of the contact (required field).
  first_name: string;

  // The last name of the contact (optional field).
  last_name?: string;

  // The email address of the contact (optional field).
  email?: string;

  // The phone number of the contact (optional field).
  phone?: string;
}
