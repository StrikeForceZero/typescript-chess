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
    it('should be nested result (Ok)', () => {
      const result = Result.capture(() => Result.Ok('foobar'));
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      if (result.isOk()) {
        expect(result.unwrap().unwrap()).toBe('foobar');
      }
      expect(() => result.unwrapErr()).toThrow();
    });
    it('should be nested result (Err)', () => {
      const result = Result.capture(() => Result.Err('foobar'));
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      if (result.isOk()) {
        expect(result.unwrap()).toStrictEqual(Result.Err('foobar'));
      }
      expect(() => result.unwrapErr()).toThrow();
      expect(() => (result.unwrapErr() as Result<unknown, unknown>).unwrap()).toThrow();
    });
    it('should be flattened result (simple OK)', () => {
      const result = Result.captureFlatten(() => Result.Ok('foobar'));
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      if (result.isOk()) {
        expect(result.unwrap()).toBe('foobar');
      }
      expect(() => result.unwrap().unwrap()).toThrow();
      expect(() => result.unwrapErr()).toThrow();
    });
    it('should be flattened result (simple Err)', () => {
      const result = Result.captureFlatten(() => Result.Err('foobar'));
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.unwrapErr()).toBe('foobar');
      }
      expect(() => result.unwrap()).toThrow();
      expect(() => (result.unwrapErr() as Result<unknown, unknown>).unwrapErr()).toThrow();
    });
    it('should be flattened result (try catch Ok)', () => {
      const result = Result.captureFlatten(() => Result.Ok('foobar'));
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      if (result.isOk()) {
        expect(result.unwrap()).toBe('foobar');
      }
      expect(() => result.unwrapErr()).toThrow();
      expect(() => (result.unwrap() as Result<unknown, unknown>).unwrap()).toThrow();
    });
    it('should be flattened result (try catch Err)', () => {
      const result = Result.captureFlatten(() => {
        throw new Error('foobar');
      });
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.unwrapErr()).toStrictEqual(new Error('foobar'));
      }
      expect(() => result.unwrap()).toThrow();
      expect(() => (result.unwrapErr() as Result<unknown, unknown>).unwrapErr()).toThrow();
    });
  });
});
