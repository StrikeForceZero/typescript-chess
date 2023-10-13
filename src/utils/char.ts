import { Opaque } from 'ts-essentials';
import { AssertionValueTypeMismatchError } from './errors/AssertionValueTypeMismatchError';

export type Char = Opaque<string, 'char'>

export function Char(input: string): Char {
  assertIsChar(input);
  return input;
}

export function isChar(value: string): value is Char {
  return value.length === 1;
}

export function assertIsChar(value: string): asserts value is Char {
  if (!isChar(value)) {
    throw new AssertionValueTypeMismatchError(value, 'Char');
  }
}

export function charTuple(input: string): [Char, Char] {
  if (input.length !== 2) {
    throw new Error(`Expected input of length 2, but received "${input}" with length ${input.length}`);
  }
  const [char1, char2] = input.split('') as [Char, Char];
  return [char1, char2];
}

export function* charIterator(str: string): IterableIterator<Char> {
  for (const char of str) {
    yield Char(char);
  }
}
