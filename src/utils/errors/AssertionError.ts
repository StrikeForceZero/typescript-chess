export class AssertionError extends Error {
  constructor(message?: string) {
    super(message);
    // Set the name of the error to the ClassName.
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
