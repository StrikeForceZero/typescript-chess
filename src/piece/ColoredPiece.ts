import { match } from 'ts-pattern';
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

export type WhitePiece = {
  color: PieceColor.White,
  type: PieceType,
}

export type BlackPiece = {
  color: PieceColor.Black,
  type: PieceType,
}

export type ColoredPiece = WhitePiece | BlackPiece;

export function from(color: PieceColor, type: PieceType): ColoredPiece {
  return {
    color,
    type,
  };
}

export function toChar(piece: ColoredPiece): ChessPieceAsciiChar {
  return pieceToChar(piece.color, piece.type);
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

