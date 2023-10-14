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

export const BoardRank = asSimpleConstEnum({
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
});
export type BoardRank = SimpleEnumTypeOf<typeof BoardRank>;

const BoardRankSet = new Set(Object.values(BoardRank));
const BoardRankSetWide: Set<number> = BoardRankSet;
export function assertIsBoardRank(value: unknown): asserts value is BoardRankChar {
  if (typeof value === 'number' && !BoardRankSetWide.has(value)) {
    throwBadValue(value);
  }
}

export const BoardRankChar = asSimpleConstEnum({
  ONE: Char('1'),
  TWO: Char('2'),
  THREE: Char('3'),
  FOUR: Char('4'),
  FIVE: Char('5'),
  SIX: Char('6'),
  SEVEN: Char('7'),
  EIGHT: Char('8'),
});
export type BoardRankChar = SimpleEnumTypeOf<typeof BoardRankChar>;

const BoardRankCharSet = new Set(Object.values(BoardRankChar));
const BoardRankCharSetWide: Set<string> = BoardRankCharSet;
export function assertIsBoardRankChar(value: unknown): asserts value is BoardRankChar {
  if (typeof value === 'string' && !BoardRankCharSetWide.has(value)) {
    throwBadValue(value);
  }
}

export function fromChar(char: Char | BoardRankChar): BoardRank {
  assertIsBoardRankChar(char);
  return fromCharUnchecked(char);
}
export function fromCharUnchecked(char: BoardRankChar): BoardRank {
  return match(char)
    .with(BoardRankChar.ONE, _ => BoardRank.ONE)
    .with(BoardRankChar.TWO, _ => BoardRank.TWO)
    .with(BoardRankChar.THREE, _ => BoardRank.THREE)
    .with(BoardRankChar.FOUR, _ => BoardRank.FOUR)
    .with(BoardRankChar.FIVE, _ => BoardRank.FIVE)
    .with(BoardRankChar.SIX, _ => BoardRank.SIX)
    .with(BoardRankChar.SEVEN, _ => BoardRank.SEVEN)
    .with(BoardRankChar.EIGHT, _ => BoardRank.EIGHT)
    .exhaustive();
}

export function fromNumber(number: number | BoardRank): BoardRank {
  assertIsBoardRank(number);
  return fromCharUnchecked(number);
}

export function fromNumberUnchecked(number: BoardRank): BoardRank {
  switch (number) {
    case BoardRank.ONE: return BoardRank.ONE;
    case BoardRank.TWO: return BoardRank.TWO;
    case BoardRank.THREE: return BoardRank.THREE;
    case BoardRank.FOUR: return BoardRank.FOUR;
    case BoardRank.FIVE: return BoardRank.FIVE;
    case BoardRank.SIX: return BoardRank.SIX;
    case BoardRank.SEVEN: return BoardRank.SEVEN;
    case BoardRank.EIGHT: return BoardRank.EIGHT;
    default: return assertExhaustive(number, 'BoardRank');
  }
}

export function toIndex(rank: BoardRank): number {
  switch (rank) {
    case BoardRank.ONE: return 0;
    case BoardRank.TWO: return 1;
    case BoardRank.THREE: return 2;
    case BoardRank.FOUR: return 3;
    case BoardRank.FIVE: return 4;
    case BoardRank.SIX: return 5;
    case BoardRank.SEVEN: return 6;
    case BoardRank.EIGHT: return 7;
    default: return assertExhaustive(rank, 'BoardRank');
  }
}

export function fromIndex(index: number | BoardSquareIndex): BoardRank {
  assertIsBoardSquareIndex(index);
  return fromIndexUnchecked(index);
}

export function fromIndexUnchecked(index: BoardSquareIndex): BoardRank {
  switch (index) {
    case BoardSquareIndex.ZERO: return BoardRank.ONE;
    case BoardSquareIndex.ONE: return BoardRank.TWO;
    case BoardSquareIndex.TWO: return BoardRank.THREE;
    case BoardSquareIndex.THREE: return BoardRank.FOUR;
    case BoardSquareIndex.FOUR: return BoardRank.FIVE;
    case BoardSquareIndex.FIVE: return BoardRank.SIX;
    case BoardSquareIndex.SIX: return BoardRank.SEVEN;
    case BoardSquareIndex.SEVEN: return BoardRank.EIGHT;
    default: return assertExhaustive(index, 'BoardSquareIndex');
  }
}
