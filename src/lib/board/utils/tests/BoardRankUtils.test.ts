import {
  describe,
  expect,
  test,
} from '@jest/globals';
import { BoardRank } from '../../BoardRank';
import {
  boardRankGenerator,
  boardRankReverseGenerator,
} from '../BoardRankUtils';

describe('BoardRankUtils', () => {
  test('should iterate all', () => {
    const gen = boardRankGenerator();
    expect(gen.next().value).toBe(BoardRank.ONE);
    expect(gen.next().value).toBe(BoardRank.TWO);
    expect(gen.next().value).toBe(BoardRank.THREE);
    expect(gen.next().value).toBe(BoardRank.FOUR);
    expect(gen.next().value).toBe(BoardRank.FIVE);
    expect(gen.next().value).toBe(BoardRank.SIX);
    expect(gen.next().value).toBe(BoardRank.SEVEN);
    expect(gen.next().value).toBe(BoardRank.EIGHT);
    expect(gen.next().done).toBe(true);
  });
  test('should iterate loop', () => {
    const gen = boardRankGenerator(BoardRank.EIGHT, true);
    expect(gen.next().value).toBe(BoardRank.EIGHT);
    // wrap around
    expect(gen.next().value).toBe(BoardRank.ONE);
  });
  test('should iterate all reverse', () => {
    const gen = boardRankReverseGenerator();
    expect(gen.next().value).toBe(BoardRank.EIGHT);
    expect(gen.next().value).toBe(BoardRank.SEVEN);
    expect(gen.next().value).toBe(BoardRank.SIX);
    expect(gen.next().value).toBe(BoardRank.FIVE);
    expect(gen.next().value).toBe(BoardRank.FOUR);
    expect(gen.next().value).toBe(BoardRank.THREE);
    expect(gen.next().value).toBe(BoardRank.TWO);
    expect(gen.next().value).toBe(BoardRank.ONE);
    expect(gen.next().done).toBe(true);
  });
  test('should iterate loop reverse', () => {
    const gen = boardRankReverseGenerator(BoardRank.ONE, true);
    expect(gen.next().value).toBe(BoardRank.ONE);
    // wrap around
    expect(gen.next().value).toBe(BoardRank.EIGHT);
  });
});
