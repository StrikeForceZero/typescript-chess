import { match } from 'ts-pattern';
import { assertExhaustive } from '../utils/assert';
import { Char } from '../utils/char';
import {
  asSimpleConstEnum,
  SimpleEnumTypeOf,
} from '../utils/SimpleEnum';
import { throwBadValue } from '../utils/throwBadValue';
import {
  assertIsBoardSquareIndex,
  BoardSquareIndex,
} from './BoardSquareIndex';

export const BoardFile = asSimpleConstEnum({
  A: Char('a'),
  B: Char('b'),
  C: Char('c'),
  D: Char('d'),
  E: Char('e'),
  F: Char('f'),
  G: Char('g'),
  H: Char('h'),
});

export type BoardFile = SimpleEnumTypeOf<typeof BoardFile>;

const BoardFileSet = new Set(Object.values(BoardFile));
const BoardFileSetWide: Set<string> = BoardFileSet;
export function assertIsBoardFile(value: unknown): asserts value is BoardFile {
  if (typeof value === 'string' && !BoardFileSetWide.has(value)) {
    throwBadValue(value);
  }
}

export function toIndex(file: BoardFile): number {
  return match(file)
    .with(BoardFile.A, _ => 0)
    .with(BoardFile.B, _ => 1)
    .with(BoardFile.C, _ => 2)
    .with(BoardFile.D, _ => 3)
    .with(BoardFile.E, _ => 4)
    .with(BoardFile.F, _ => 5)
    .with(BoardFile.G, _ => 6)
    .with(BoardFile.H, _ => 7)
    .exhaustive();
}

export function fromIndex(value: number | BoardSquareIndex): BoardFile {
  assertIsBoardSquareIndex(value);
  return fromIndexUnchecked(value);
}

export function fromIndexUnchecked(value: BoardSquareIndex): BoardFile {
  switch (value) {
    case BoardSquareIndex.ZERO: return BoardFile.A;
    case BoardSquareIndex.ONE: return BoardFile.B;
    case BoardSquareIndex.TWO: return BoardFile.C;
    case BoardSquareIndex.THREE: return BoardFile.D;
    case BoardSquareIndex.FOUR: return BoardFile.E;
    case BoardSquareIndex.FIVE: return BoardFile.F;
    case BoardSquareIndex.SIX: return BoardFile.G;
    case BoardSquareIndex.SEVEN: return BoardFile.H;
    default: return assertExhaustive(value, 'BoardSquareIndex');
  }
}

export function fromCharUnchecked(char: Char | BoardFile): BoardFile {
  assertIsBoardFile(char);
  return fromChar(char);
}

export function fromChar(char: BoardFile): BoardFile {
  return match(char)
    .with(BoardFile.A, _ => BoardFile.A)
    .with(BoardFile.B, _ => BoardFile.B)
    .with(BoardFile.C, _ => BoardFile.C)
    .with(BoardFile.D, _ => BoardFile.D)
    .with(BoardFile.E, _ => BoardFile.E)
    .with(BoardFile.F, _ => BoardFile.F)
    .with(BoardFile.G, _ => BoardFile.G)
    .with(BoardFile.H, _ => BoardFile.H)
    .exhaustive();
}
