import { Opaque } from 'ts-essentials';
import { AssertionValueTypeMismatchError } from './errors/AssertionValueTypeMismatchError';

export type Char = Opaque<string, 'char'>

export function isChar(value: string): value is Char {
  return value.length === 1;
}

export function assertIsChar(value: string): asserts value is Char {
  if (!isChar(value)) {
    throw new AssertionValueTypeMismatchError(value, 'Char');
  }
}
