import { PieceColor } from './PieceColor';
import { PieceType } from './PieceType';

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
