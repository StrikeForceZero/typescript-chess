import { removeErrorConstructorFromStackTrace } from '../error';
import { AssertionError } from './AssertionError';

export const Identifier = 'NotExhaustiveOrInvalidValueError';

export class NotExhaustiveOrInvalidValueError extends AssertionError {
  constructor(value?: unknown, customMessage?: string) {
    let message = `Unexpected value: ${value}`;
    if (customMessage) {
      message += `, message: ${customMessage}`;
    }
    super(message);
    this.name = Identifier;

    removeErrorConstructorFromStackTrace(this);
    // some environments might require this for instanceof checks to work
    Object.setPrototypeOf(this, NotExhaustiveOrInvalidValueError.prototype);
  }
}
