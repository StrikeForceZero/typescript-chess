import { isChar } from '../utils/StringUtils';
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

export function toChar(piece: ColoredPiece): string {
  return pieceToChar(piece.color, piece.type);
}


export function fromChar(char: string): ColoredPiece {
  if (!isChar(char)) {
    throw new Error(`'${char}' is not a char!`);
  }
  switch (char) {
    case 'P': return from(PieceColor.White, PieceType.Pawn);
    case 'R': return from(PieceColor.White, PieceType.Rook);
    case 'N': return from(PieceColor.White, PieceType.Knight);
    case 'B': return from(PieceColor.White, PieceType.Bishop);
    case 'Q': return from(PieceColor.White, PieceType.Queen);
    case 'K': return from(PieceColor.White, PieceType.King);
    case 'p': return from(PieceColor.Black, PieceType.Pawn);
    case 'r': return from(PieceColor.Black, PieceType.Rook);
    case 'n': return from(PieceColor.Black, PieceType.Knight);
    case 'b': return from(PieceColor.Black, PieceType.Bishop);
    case 'q': return from(PieceColor.Black, PieceType.Queen);
    case 'k': return from(PieceColor.Black, PieceType.King);
    default: throw new Error(`Invalid value: ${char}`);
  }
}
