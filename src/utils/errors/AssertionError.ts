import { removeErrorConstructorFromStackTrace } from '../error';

export const Identifier = 'AssertionError';

export class AssertionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = Identifier;

    removeErrorConstructorFromStackTrace(this);
    // some environments might require this for instanceof checks to work
    Object.setPrototypeOf(this, AssertionError.prototype);
  }
}
