import { assertExhaustive } from '../utils/assert';
import { ChessPieceAsciiChar } from './ChessPieceAsciiChar';
import { PieceColor } from './PieceColor';

export enum PieceType {
  Pawn = 'pawn',
  Rook = 'rook',
  Knight = 'knight',
  Bishop = 'bishop',
  Queen = 'queen',
  King = 'king',
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
