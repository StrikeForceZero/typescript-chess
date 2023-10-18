import { isChar } from '../utils/char';

export enum PieceColor {
  White = 'white',
  Black = 'black',
}

export const InverseColorMap = {
  [PieceColor.White]: PieceColor.Black,
  [PieceColor.Black]: PieceColor.White,
} as const satisfies Record<PieceColor, PieceColor>;

export function toChar(color: PieceColor): string {
  switch (color) {
    case PieceColor.White: return 'w';
    case PieceColor.Black: return 'b';
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
