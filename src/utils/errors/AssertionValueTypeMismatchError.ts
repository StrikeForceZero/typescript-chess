import { getClassName } from '../object';
import { stringifySafe } from '../stringifySafe';
import { AssertionError } from './AssertionError';

export const Identifier = 'AssertionValueTypeMismatchError';

export class AssertionValueTypeMismatchError extends AssertionError {
  constructor(value: unknown, expectedType: string) {
    super(AssertionValueTypeMismatchError.createMessage(value, expectedType));
    this.name = Identifier;

    // some environments might require this for instanceof checks to work
    Object.setPrototypeOf(this, AssertionValueTypeMismatchError.prototype);
  }

  public static createMessage(value: unknown, expectedType: string): string {
    const valueStr = typeof value === 'object' ? stringifySafe(value) : getClassName(value) ?? stringifySafe(value);
    return `${valueStr} is not a ${expectedType}`;
  }
}
