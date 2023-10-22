import { removeErrorConstructorFromStackTrace } from '../error';

export const Identifier = 'InvalidMoveError';

export class InvalidMoveError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = Identifier;

    removeErrorConstructorFromStackTrace(this);
  }
}
