import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { captureError } from '../../error';
import { AssertionError } from '../AssertionError';

describe('AssertionError', () => {

  function throwAssertionError(): never {
    throw new AssertionError()
  }

  it('should have correct stack trace', () => {
    const error1 = captureError(throwAssertionError) as AssertionError;
    expect(error1.stack?.split('\n')[1]).toContain('throwAssertionError');
  });
});
