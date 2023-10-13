import {
  describe,
  expect,
  it,
} from '@jest/globals';
import {
  Char,
  charIterator,
  charTuple,
  isChar,
} from '../char';

describe('char', () => {
  it('should validate chars', () => {
    expect(Char('a')).toBe('a');
    expect(() => Char('')).toThrow();
    expect(() => Char('aa')).toThrow();
    expect(isChar('a')).toBe(true);
    expect(isChar('aa')).toBe(false);
    expect(isChar('')).toBe(false);
  });
  it('should iterate chars', () => {
    const chars: string[] = [];
    for (const char of charIterator('abc')) {
      chars.push(char);
    }
    expect(chars).toEqual(['a', 'b', 'c']);
  });
  it('should get char tuple', () => {
    expect(charTuple('ab')).toStrictEqual(['a', 'b']);
    expect(() => charTuple('b')).toThrow();
    expect(() => charTuple('')).toThrow();
    expect(() => charTuple('abc')).toThrow();
  });
});
