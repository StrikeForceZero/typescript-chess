import { Opaque } from 'ts-essentials';
import { AssertionValueTypeMismatchError } from './errors/AssertionValueTypeMismatchError';

export type Char<TChar extends string = string> = Opaque<TChar, 'char'>

export function Char<TChar extends string>(input: TChar): Char<TChar> {
  assertIsChar(input);
  return input;
}

export function isChar<TChar extends string>(value: TChar): value is Char<TChar> {
  return value.length === 1;
}

export function assertIsChar<TChar extends string>(value: TChar): asserts value is Char<TChar> {
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
