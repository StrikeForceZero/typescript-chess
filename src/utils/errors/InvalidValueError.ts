import { removeErrorConstructorFromStackTrace } from '../error';

export const Identifier = 'InvalidValueError';

export class InvalidValueError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = Identifier;

    removeErrorConstructorFromStackTrace(this);
  }
}
