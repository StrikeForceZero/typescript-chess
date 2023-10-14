import { Char } from '../utils/char';
import {
  asSimpleEnum,
  SimpleEnumTypeOf,
} from '../utils/SimpleEnum';
import { throwBadValue } from '../utils/throwBadValue';

export const ChessPieceAsciiChar = asSimpleEnum({
  WhitePawn: Char('P'),
  WhiteKnight: Char('N'),
  WhiteBishop: Char('B'),
  WhiteRook: Char('R'),
  WhiteQueen: Char('Q'),
  WhiteKing: Char('K'),
  BlackPawn: Char('p'),
  BlackKnight: Char('n'),
  BlackBishop: Char('b'),
  BlackRook: Char('r'),
  BlackQueen: Char('q'),
  BlackKing: Char('k'),
});


export type ChessPieceAsciiChar = SimpleEnumTypeOf<typeof ChessPieceAsciiChar>;

const ChessPieceAsciiCharSet = new Set(Object.values(ChessPieceAsciiChar));
const ChessPieceAsciiCharSetWide: Set<string> = ChessPieceAsciiCharSet;
export function assertIsChessPieceAsciiChar(value: unknown): asserts value is ChessPieceAsciiChar {
  if (typeof value === 'string' && !ChessPieceAsciiCharSetWide.has(value)) {
    throwBadValue(value);
  }
}
