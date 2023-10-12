import { getClassName } from '../object';
import { stringifySafe } from '../stringifySafe';
import { AssertionError } from './AssertionError';

export class AssertionValueTypeMismatchError extends AssertionError {
  constructor(value: unknown, expectedType: string) {
    super(AssertionValueTypeMismatchError.createMessage(value, expectedType));
    // Set the name of the error to the ClassName.
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public static createMessage(value: unknown, expectedType: string): string {
    const valueStr = getClassName(value) ?? stringifySafe(value);
    return `${valueStr} is not a ${expectedType}`;
  }
}
