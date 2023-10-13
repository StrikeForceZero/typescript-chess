import { removeErrorConstructorFromStackTrace } from '../error';
import { AssertionError } from './AssertionError';

export const Identifier = 'AssertNeverError';

export class AssertNeverError extends AssertionError {
  constructor(message?: string) {
    super(message);
    this.name = Identifier;

    removeErrorConstructorFromStackTrace(this);
  }
}
