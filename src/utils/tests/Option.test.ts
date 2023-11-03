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
    it('should serialize', () => {
      expect(JSON.stringify(Option.Some(1))).toBe(JSON.stringify({ type: 'some', value: 1 }));
      expect(Option.Some(1).toString()).toBe('Some(1)');
      expect(Option.Some('foo').toString()).toBe('Some("foo")');
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
    it('should serialize', () => {
      expect(JSON.stringify(Option.None())).toBe(JSON.stringify({ type: 'none' }));
      expect(Option.None().toString()).toBe('None');
    });
  });
  describe('isValueEqual', () => {
    it('should work as expected', () => {
      expect(Option.None().isValueEqual(Option.None())).toBe(true);
      expect(Option.None().isValueEqual(Option.Some(1))).toBe(false);
      expect(Option.Some(1).isValueEqual(Option.Some(1))).toBe(true);
      expect(Option.Some<boolean | number>(1).isValueEqual(Option.Some(false))).toBe(false);
    });
  });
});
