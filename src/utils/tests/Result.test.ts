import {
  describe,
  it,
  expect,
} from '@jest/globals';
import { Result } from '../Result';

describe('Result', () => {
  describe('Ok', () => {
    it('should be ok', () => {
      const result = Result.Ok(1);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      if (result.isOk()) {
        expect(result.unwrap()).toBe(1);
      }
      expect(() => result.unwrapErr()).toThrow();
    });
  });
  describe('Err', () => {
    it('should be err', () => {
      const result = Result.Err(1);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.unwrapErr()).toBe(1);
      }
      expect(() => result.unwrap()).toThrow();
    });
  });
  describe('capture', () => {
    it('should be err', () => {
      const result = Result.capture(() => { throw 'whoops'; });
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.unwrapErr()).toBe('whoops');
      }
      expect(() => result.unwrap()).toThrow();
    });
    it('should be result', () => {
      const result = Result.capture(() => 'foobar');
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      if (result.isOk()) {
        expect(result.unwrap()).toBe('foobar');
      }
      expect(() => result.unwrapErr()).toThrow();
    });
  });
});
