import {
  asSimpleConstEnum,
  SimpleEnumTypeOf,
} from '../utils/SimpleEnum';
import { throwBadValue } from '../utils/throwBadValue';

export const BoardSquareIndex = asSimpleConstEnum({
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
});

export type BoardSquareIndex = SimpleEnumTypeOf<typeof BoardSquareIndex>;

const BoardSquareIndexSet = new Set(Object.values(BoardSquareIndex));
const BoardSquareIndexSetWide: Set<number> = BoardSquareIndexSet;
export function assertIsBoardSquareIndex(value: unknown): asserts value is BoardSquareIndex {
  if (typeof value === 'number' && !BoardSquareIndexSetWide.has(value)) {
    throwBadValue(value);
  }
}
