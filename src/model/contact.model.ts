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
  id: number; // Unique identifier for the contact (can be generated or provided).
  first_name: string; // The first name of the contact (required field).
  last_name?: string; // (Optional) The last name of the contact.
  email?: string; // (Optional) The email address of the contact.
  phone?: string; // (Optional) The phone number of the contact.
}
