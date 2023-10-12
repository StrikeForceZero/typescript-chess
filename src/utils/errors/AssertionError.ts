import { removeErrorConstructorFromStackTrace } from '../error';

export class AssertionError extends Error {
  constructor(message?: string) {
    super(message);
    // Set the name of the error to the ClassName.
    this.name = this.constructor.name;

    removeErrorConstructorFromStackTrace(this);
  }
}
