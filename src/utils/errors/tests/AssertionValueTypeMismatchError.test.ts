import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { captureError } from '../../error';
import {
  AssertionValueTypeMismatchError,
  Identifier,
} from '../AssertionValueTypeMismatchError';

describe('AssertionValueTypeMismatchError', () => {

  function throwAssertionError(value: unknown, expectedType: string): never {
    throw new AssertionValueTypeMismatchError(value, expectedType);
  }

  it('should have correct stack trace', () => {
    const error1 = captureError(() => throwAssertionError(1, 'string')) as AssertionValueTypeMismatchError;
    expect(error1.stack?.split('\n')[1]).toContain('throwAssertionError');
  });

  it('should have the correct name', () => {
    expect(new AssertionValueTypeMismatchError(1, 'string').name).toBe(Identifier);
  });

  it('should have the correct message', () => {
    expect(new AssertionValueTypeMismatchError(1, 'string').message).toBe(AssertionValueTypeMismatchError.createMessage(1, 'string'));
  });

  it('createMessage should create the expected message', () => {
    expect(AssertionValueTypeMismatchError.createMessage(1, 'string')).toBe('1 is not a string');
    expect(AssertionValueTypeMismatchError.createMessage('foo', 'number')).toBe('"foo" is not a number');
    expect(AssertionValueTypeMismatchError.createMessage(null, 'number')).toBe('null is not a number');
    expect(AssertionValueTypeMismatchError.createMessage({}, 'number')).toBe('{} is not a number');
    expect(AssertionValueTypeMismatchError.createMessage({ foo: 1 }, 'number')).toBe('{"foo":1} is not a number');
  });
});
