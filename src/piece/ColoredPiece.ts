import { Alge } from 'alge';
import { match } from 'ts-pattern';
import { z } from 'zod';
import { assertExhaustive } from '../utils/assert';
import { Char } from '../utils/char';
import {
  assertIsChessPieceAsciiChar,
  ChessPieceAsciiChar,
} from './ChessPieceAsciiChar';
import { PieceColor } from './PieceColor';
import {
  PieceType,
  toChar as pieceToChar,
} from './PieceType';

const PieceTypeValue = z.nativeEnum(PieceType);
export const ColoredPiece = Alge.data('ColoredPiece', {
  WhitePiece: {
    color: z.enum([PieceColor.White]), // this is redundant but saves us a lot of refactoring
    pieceType: PieceTypeValue,
  },
  BlackPiece: {
    color: z.enum([PieceColor.Black]), // this is redundant but saves us a lot of refactoring
    pieceType: PieceTypeValue,
  },
});
type ColoredPieceInferred = Alge.Infer<typeof ColoredPiece>
export type ColoredPiece = ColoredPieceInferred['*']

export function toColor(piece: ColoredPiece): PieceColor {
  return piece.color;
}

export function from(color: PieceColor, type: PieceType): ColoredPiece {
  switch (color) {
    case PieceColor.White: return ColoredPiece.WhitePiece.create({ color, pieceType: type });
    case PieceColor.Black: return ColoredPiece.BlackPiece.create({ color, pieceType: type });
    default: return assertExhaustive(color);
  }
}

export function toPiece(piece: ColoredPiece): PieceType {
  return piece.pieceType;
}

export function toChar(piece: ColoredPiece): ChessPieceAsciiChar {
  return pieceToChar(toColor(piece), toPiece(piece));
}


export function fromChar(char: Char | ChessPieceAsciiChar): ColoredPiece {
  assertIsChessPieceAsciiChar(char);
  return fromCharUnchecked(char);
}

export function fromCharUnchecked(char: ChessPieceAsciiChar): ColoredPiece {
  return match(char)
    .with(ChessPieceAsciiChar.WhitePawn, _ => from(PieceColor.White, PieceType.Pawn))
    .with(ChessPieceAsciiChar.WhiteRook, _ => from(PieceColor.White, PieceType.Rook))
    .with(ChessPieceAsciiChar.WhiteKnight, _ => from(PieceColor.White, PieceType.Knight))
    .with(ChessPieceAsciiChar.WhiteBishop, _ => from(PieceColor.White, PieceType.Bishop))
    .with(ChessPieceAsciiChar.WhiteQueen, _ => from(PieceColor.White, PieceType.Queen))
    .with(ChessPieceAsciiChar.WhiteKing, _ => from(PieceColor.White, PieceType.King))
    .with(ChessPieceAsciiChar.BlackPawn, _ => from(PieceColor.Black, PieceType.Pawn))
    .with(ChessPieceAsciiChar.BlackRook, _ => from(PieceColor.Black, PieceType.Rook))
    .with(ChessPieceAsciiChar.BlackKnight, _ => from(PieceColor.Black, PieceType.Knight))
    .with(ChessPieceAsciiChar.BlackBishop, _ => from(PieceColor.Black, PieceType.Bishop))
    .with(ChessPieceAsciiChar.BlackQueen, _ => from(PieceColor.Black, PieceType.Queen))
    .with(ChessPieceAsciiChar.BlackKing, _ => from(PieceColor.Black, PieceType.King))
    .exhaustive();
}

