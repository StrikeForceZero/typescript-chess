import { match } from 'ts-pattern';
import { assertExhaustive } from '../utils/assert';
import { Char } from '../utils/char';
import {
  asSimpleConstEnum,
  SimpleEnumTypeOf,
} from '../utils/SimpleEnum';
import { throwBadValue } from '../utils/throwBadValue';

export enum PieceType {
  Pawn = 'pawn',
  Rook = 'rook',
  Knight = 'knight',
  Bishop = 'bishop',
  Queen = 'queen',
  King = 'king',
}

export const PieceAsciiChar = asSimpleConstEnum({
  Pawn: Char('P'),
  Knight: Char('N'),
  Bishop: Char('B'),
  Rook: Char('R'),
  Queen: Char('Q'),
  King: Char('K'),
});

export type PieceAsciiChar = SimpleEnumTypeOf<typeof PieceAsciiChar>;

const PieceAsciiCharSet = new Set(Object.values(PieceAsciiChar));
const PieceAsciiCharWide: Set<string> = PieceAsciiCharSet;

export function assertIsPieceAsciiChar(value: unknown): asserts value is PieceAsciiChar {
  if (typeof value === 'string' && !PieceAsciiCharWide.has(value)) {
    throwBadValue(value);
  }
}

export function toChar(pieceType: PieceType): PieceAsciiChar {
  switch (pieceType) {
    case PieceType.Pawn: return PieceAsciiChar.Pawn;
    case PieceType.Rook: return PieceAsciiChar.Rook;
    case PieceType.Knight: return PieceAsciiChar.Knight;
    case PieceType.Bishop: return PieceAsciiChar.Bishop;
    case PieceType.Queen: return PieceAsciiChar.Queen;
    case PieceType.King: return PieceAsciiChar.King;
    default: return assertExhaustive(pieceType);
  }
}

export function fromChar(char: Char | PieceAsciiChar): PieceType {
  assertIsPieceAsciiChar(char);
  return fromCharUnchecked(char);
}

export function fromCharUnchecked(char: PieceAsciiChar): PieceType {
  return match(char)
    .with(PieceAsciiChar.Pawn, _ => PieceType.Pawn)
    .with(PieceAsciiChar.Rook, _ => PieceType.Rook)
    .with(PieceAsciiChar.Knight, _ => PieceType.Knight)
    .with(PieceAsciiChar.Bishop, _ => PieceType.Bishop)
    .with(PieceAsciiChar.Queen, _ => PieceType.Queen)
    .with(PieceAsciiChar.King, _ => PieceType.King)
    .exhaustive();
}
