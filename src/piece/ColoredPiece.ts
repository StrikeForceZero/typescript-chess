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

function _create(color: PieceColor, type: PieceType): ColoredPiece {
  switch (color) {
    case PieceColor.White: return ColoredPiece.WhitePiece.create({ color, pieceType: type });
    case PieceColor.Black: return ColoredPiece.BlackPiece.create({ color, pieceType: type });
    default: return assertExhaustive(color);
  }
}

export function toColor(piece: ColoredPiece): PieceColor {
  return piece.color;
}

export function from(color: PieceColor, pieceType: PieceType): ColoredPiece {
  return match([color, pieceType])
    .with([PieceColor.White, PieceType.Pawn], _ => WhitePawn)
    .with([PieceColor.White, PieceType.Knight], _ => WhiteKnight)
    .with([PieceColor.White, PieceType.Bishop], _ => WhiteBishop)
    .with([PieceColor.White, PieceType.Rook], _ => WhiteRook)
    .with([PieceColor.White, PieceType.Queen], _ => WhiteQueen)
    .with([PieceColor.White, PieceType.King], _ => WhiteKing)
    .with([PieceColor.Black, PieceType.Pawn], _ => BlackPawn)
    .with([PieceColor.Black, PieceType.Knight], _ => BlackKnight)
    .with([PieceColor.Black, PieceType.Bishop], _ => BlackBishop)
    .with([PieceColor.Black, PieceType.Rook], _ => BlackRook)
    .with([PieceColor.Black, PieceType.Queen], _ => BlackQueen)
    .with([PieceColor.Black, PieceType.King], _ => BlackKing)
    .exhaustive();
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

export const WhitePawn = _create(PieceColor.White, PieceType.Pawn);
export const WhiteKnight = _create(PieceColor.White, PieceType.Knight);
export const WhiteBishop = _create(PieceColor.White, PieceType.Bishop);
export const WhiteRook = _create(PieceColor.White, PieceType.Rook);
export const WhiteQueen = _create(PieceColor.White, PieceType.Queen);
export const WhiteKing = _create(PieceColor.White, PieceType.King);

export const BlackPawn = _create(PieceColor.Black, PieceType.Pawn);
export const BlackKnight = _create(PieceColor.Black, PieceType.Knight);
export const BlackBishop = _create(PieceColor.Black, PieceType.Bishop);
export const BlackRook = _create(PieceColor.Black, PieceType.Rook);
export const BlackQueen = _create(PieceColor.Black, PieceType.Queen);
export const BlackKing = _create(PieceColor.Black, PieceType.King);
