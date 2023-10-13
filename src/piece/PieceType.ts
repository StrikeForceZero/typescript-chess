import { Char } from '../utils/char';
import { PieceColor } from './PieceColor';

export enum PieceType {
  Pawn = 'pawn',
  Rook = 'rook',
  Knight = 'knight',
  Bishop = 'bishop',
  Queen = 'queen',
  King = 'king',
}

export function toChar(color: PieceColor, piece: PieceType): Char {
  switch (color) {
    case PieceColor.White:
      switch (piece) {
        case PieceType.Pawn: return 'P' as Char;
        case PieceType.Rook: return 'R' as Char;
        case PieceType.Knight: return 'N' as Char;
        case PieceType.Bishop: return 'B' as Char;
        case PieceType.Queen: return 'Q' as Char;
        case PieceType.King: return 'K' as Char;
        default: throw new Error(`${piece} is not a valid PieceType`)
      }
    case PieceColor.Black:
      switch (piece) {
        case PieceType.Pawn: return 'p' as Char;
        case PieceType.Rook: return 'r' as Char;
        case PieceType.Knight: return 'n' as Char;
        case PieceType.Bishop: return 'b' as Char;
        case PieceType.Queen: return 'q' as Char;
        case PieceType.King: return 'k' as Char;
        default: throw new Error(`${piece} is not a valid PieceType`)
      }
    default: throw new Error(`${color} is not a valid PieceColor`)
  }
}
