import {
  describe,
  expect,
  it,
} from '@jest/globals';
import {
  DiagonalDirection,
  Direction,
  SimpleDirection,
} from '../direction';

describe('Direction', () => {
  it('Direction should contain all other enums', () => {
    const directions = Object.values(Direction);
    for (const direction of Object.values(SimpleDirection)) {
      expect(directions).toContain(direction);
    }
    for (const direction of Object.values(DiagonalDirection)) {
      expect(directions).toContain(direction);
    }
  });
});
