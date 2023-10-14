import { assertExhaustive } from '../utils/assert';
import { isChar } from '../utils/char';

export enum BoardFile {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  E = 'e',
  F = 'f',
  G = 'g',
  H = 'h',
}

export function toIndex(file: BoardFile): number {
  switch (file) {
    case BoardFile.A: return 0;
    case BoardFile.B: return 1;
    case BoardFile.C: return 2;
    case BoardFile.D: return 3;
    case BoardFile.E: return 4;
    case BoardFile.F: return 5;
    case BoardFile.G: return 6;
    case BoardFile.H: return 7;
    default: return assertExhaustive(file, 'BoardFile');
  }
}

export function fromIndex(value: number): BoardFile {
  switch (value) {
    case 0: return BoardFile.A;
    case 1: return BoardFile.B;
    case 2: return BoardFile.C;
    case 3: return BoardFile.D;
    case 4: return BoardFile.E;
    case 5: return BoardFile.F;
    case 6: return BoardFile.G;
    case 7: return BoardFile.H;
    default: throw new Error(`Invalid value: ${value}`);
  }
}

export function fromChar(char: string): BoardFile {
  if (!isChar(char)) {
    throw new Error(`'${char}' is not a char`);
  }
  switch (char.toLowerCase()) {
    case 'a': return BoardFile.A;
    case 'b': return BoardFile.B;
    case 'c': return BoardFile.C;
    case 'd': return BoardFile.D;
    case 'e': return BoardFile.E;
    case 'f': return BoardFile.F;
    case 'g': return BoardFile.G;
    case 'h': return BoardFile.H;
    default: throw new Error(`Invalid value: ${char}`);
  }
}
