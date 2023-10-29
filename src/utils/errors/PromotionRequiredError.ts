import { removeErrorConstructorFromStackTrace } from '../error';
import { InvalidMoveError } from './InvalidMoveError';

export const Identifier = 'PromotionRequiredError';
export class PromotionRequiredError extends InvalidMoveError {
  constructor(message: string = 'Pawn promotion is required!') {
    super(message);
    this.name = Identifier;

    removeErrorConstructorFromStackTrace(this);
    // some environments might require this for instanceof checks to work
    Object.setPrototypeOf(this, PromotionRequiredError.prototype);
  }
}
