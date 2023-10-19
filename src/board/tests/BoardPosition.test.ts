import { describe, it, expect } from '@jest/globals';
import { BoardPosition } from '../BoardPosition';

describe('BoardPosition', () => {
  describe('fromString', () => {
    it('should handle upper case', () => {
      expect(BoardPosition.fromString('A1').toString()).toBe('a1');
    });
    it('should handle lower case', () => {
      expect(BoardPosition.fromString('A1').toString()).toBe('a1');
    });
  });
});
