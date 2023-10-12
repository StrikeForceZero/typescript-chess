import {
  describe,
  expect,
  test,
} from '@jest/globals';
import { BoardFile } from '../../BoardFile';
import {
  boardFileGenerator,
  boardFileReverseGenerator,
} from '../BoardFileUtils';

describe('BoardFileUtils', () => {
  test('should iterate all', () => {
    const gen = boardFileGenerator();
    expect(gen.next().value).toBe(BoardFile.A);
    expect(gen.next().value).toBe(BoardFile.B);
    expect(gen.next().value).toBe(BoardFile.C);
    expect(gen.next().value).toBe(BoardFile.D);
    expect(gen.next().value).toBe(BoardFile.E);
    expect(gen.next().value).toBe(BoardFile.F);
    expect(gen.next().value).toBe(BoardFile.G);
    expect(gen.next().value).toBe(BoardFile.H);
    expect(gen.next().done).toBe(true);
  });
  test('should iterate loop', () => {
    const gen = boardFileGenerator(BoardFile.H, true);
    expect(gen.next().value).toBe(BoardFile.H);
    // wrap around
    expect(gen.next().value).toBe(BoardFile.A);
  });
  test('should iterate all reverse', () => {
    const gen = boardFileReverseGenerator();
    expect(gen.next().value).toBe(BoardFile.H);
    expect(gen.next().value).toBe(BoardFile.G);
    expect(gen.next().value).toBe(BoardFile.F);
    expect(gen.next().value).toBe(BoardFile.E);
    expect(gen.next().value).toBe(BoardFile.D);
    expect(gen.next().value).toBe(BoardFile.C);
    expect(gen.next().value).toBe(BoardFile.B);
    expect(gen.next().value).toBe(BoardFile.A);
    expect(gen.next().done).toBe(true);
  });
  test('should iterate loop reverse', () => {
    const gen = boardFileReverseGenerator(BoardFile.A, true);
    expect(gen.next().value).toBe(BoardFile.A);
    // wrap around
    expect(gen.next().value).toBe(BoardFile.H);
  });
});
