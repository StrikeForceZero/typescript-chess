import { PieceColor } from './PieceColor';

export enum PieceType {
  Pawn = 'pawn',
  Rook = 'rook',
  Knight = 'knight',
  Bishop = 'bishop',
  Queen = 'queen',
  King = 'king',
}

export function toChar(color: PieceColor, piece: PieceType) {
  switch (color) {
    case PieceColor.White:
      switch (piece) {
        case PieceType.Pawn: return 'P';
        case PieceType.Rook: return 'R';
        case PieceType.Knight: return 'N';
        case PieceType.Bishop: return 'B';
        case PieceType.Queen: return 'Q';
        case PieceType.King: return 'K';
        default: throw new Error(`${piece} is not a valid PieceType`)
      }
    case PieceColor.Black:
      switch (piece) {
        case PieceType.Pawn: return 'p';
        case PieceType.Rook: return 'r';
        case PieceType.Knight: return 'n';
        case PieceType.Bishop: return 'b';
        case PieceType.Queen: return 'q';
        case PieceType.King: return 'k';
        default: throw new Error(`${piece} is not a valid PieceType`)
      }
    default: throw new Error(`${color} is not a valid PieceColor`)
  }
}
