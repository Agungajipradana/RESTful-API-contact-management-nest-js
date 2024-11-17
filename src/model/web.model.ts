// A generic class to structure the response data for the web API.
export class WebResponse<T> {
  // The `data` property is optional and holds the response data of type T (generic).
  data?: T;

  // The `errors` property is optional and holds any error message as a string.
  errors?: string;
}
