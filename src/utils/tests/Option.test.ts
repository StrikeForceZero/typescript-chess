import {
  describe,
  it,
  expect,
} from '@jest/globals';
import { Option } from '../Option';

describe('Option', () => {
  describe('Some', () => {
    it('should be some', () => {
      const option = Option.Some(1);
      expect(option.isSome()).toBe(true);
      expect(option.isNone()).toBe(false);
      if (option.isSome()) {
        expect(option.unwrap()).toBe(1);
        expect(option.value).toBe(1);
      }
    });
  });
  describe('None', () => {
    it('should be None', () => {
      const result = Option.None();
      expect(result.isSome()).toBe(false);
      expect(result.isNone()).toBe(true);
      if (result.isNone()) {
        expect(() => result.unwrap()).toThrow();
      }
    });
  });
});
