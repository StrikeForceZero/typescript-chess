import {
  describe,
  it,
  expect,
} from '@jest/globals';
import { omit } from '../object';

describe('object', () => {
  describe('omit', () => {
    it('should omit', () => {
      const obj = { foo: 1, bar: 2, fizz: 'buzz', buzz: 'fizz' };
      const keys = ['fizz', 'buzz'] as const;
      expect(omit(obj, keys)).toStrictEqual({ foo: 1, bar: 2 });
      expect(omit(obj, 'fizz', 'buzz')).toStrictEqual({ foo: 1, bar: 2 });
      expect(omit(obj, ['fizz', 'buzz'])).toStrictEqual({ foo: 1, bar: 2 });
      expect(omit(obj, ...keys)).toStrictEqual({ foo: 1, bar: 2 });
    });
  });
});
