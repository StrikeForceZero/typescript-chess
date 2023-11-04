import { assertExhaustive } from '../utils/assert';
import { Char } from '../utils/char';
import {
  asSimpleConstEnum,
  SimpleEnumTypeOf,
} from '../utils/SimpleEnum';
import { throwBadValue } from '../utils/throwBadValue';
import { PieceColor } from './PieceColor';
import { PieceType } from './PieceType';

export const ChessPieceAsciiChar = asSimpleConstEnum({
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

export function toChar(color: PieceColor, piece: PieceType): ChessPieceAsciiChar {
  switch (color) {
    case PieceColor.White:
      switch (piece) {
        case PieceType.Pawn: return ChessPieceAsciiChar.WhitePawn;
        case PieceType.Rook: return ChessPieceAsciiChar.WhiteRook;
        case PieceType.Knight: return ChessPieceAsciiChar.WhiteKnight;
        case PieceType.Bishop: return ChessPieceAsciiChar.WhiteBishop;
        case PieceType.Queen: return ChessPieceAsciiChar.WhiteQueen;
        case PieceType.King: return ChessPieceAsciiChar.WhiteKing;
        default: return assertExhaustive(piece, 'PieceType');
      }
    case PieceColor.Black:
      switch (piece) {
        case PieceType.Pawn: return ChessPieceAsciiChar.BlackPawn;
        case PieceType.Rook: return ChessPieceAsciiChar.BlackRook;
        case PieceType.Knight: return ChessPieceAsciiChar.BlackKnight;
        case PieceType.Bishop: return ChessPieceAsciiChar.BlackBishop;
        case PieceType.Queen: return ChessPieceAsciiChar.BlackQueen;
        case PieceType.King: return ChessPieceAsciiChar.BlackKing;
        default: return assertExhaustive(piece, 'PieceType');
      }
    default: return assertExhaustive(color, 'Color');
  }
}
