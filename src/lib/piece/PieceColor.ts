import { isChar } from '../utils/StringUtils';

export enum PieceColor {
  White,
  Black,
}

export function toChar(color: PieceColor): string {
  switch (color) {
    case PieceColor.White: return "w";
    case PieceColor.Black: return "b";
  }
}

export function fromChar(char: string): PieceColor {
  if (!isChar(char)) {
    throw new Error(`'${char}' is not a single char`);
  }
  switch (char.toLowerCase()) {
    case 'w': return PieceColor.White;
    case 'b': return PieceColor.Black;
    default: throw new Error(`Invalid value: ${char}`);
  }
}
