import { isChar } from '../utils/char';

export enum BoardRank {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8
}

export function fromChar(char: string): BoardRank {
  if (!isChar(char)) {
    throw new Error(`'${char}' is not a char`);
  }
  switch (char) {
    case '1': return BoardRank.ONE;
    case '2': return BoardRank.TWO;
    case '3': return BoardRank.THREE;
    case '4': return BoardRank.FOUR;
    case '5': return BoardRank.FIVE;
    case '6': return BoardRank.SIX;
    case '7': return BoardRank.SEVEN;
    case '8': return BoardRank.EIGHT;
    default: throw new Error(`Invalid value: ${char}`);
  }
}

export function fromNumber(number: number): BoardRank {
  switch (number) {
    case 1: return BoardRank.ONE;
    case 2: return BoardRank.TWO;
    case 3: return BoardRank.THREE;
    case 4: return BoardRank.FOUR;
    case 5: return BoardRank.FIVE;
    case 6: return BoardRank.SIX;
    case 7: return BoardRank.SEVEN;
    case 8: return BoardRank.EIGHT;
    default: throw new Error(`Invalid value: ${number}`);
  }
}

export function toIndex(rank: BoardRank): number {
  switch (rank) {
    case BoardRank.ONE: return 0;
    case BoardRank.TWO: return 1;
    case BoardRank.THREE: return 2;
    case BoardRank.FOUR: return 3;
    case BoardRank.FIVE: return 4;
    case BoardRank.SIX: return 5;
    case BoardRank.SEVEN: return 6;
    case BoardRank.EIGHT: return 7;
  }
}

export function fromIndex(index: number): BoardRank {
  switch (index) {
    case 0: return BoardRank.ONE;
    case 1: return BoardRank.TWO;
    case 2: return BoardRank.THREE;
    case 3: return BoardRank.FOUR;
    case 4: return BoardRank.FIVE;
    case 5: return BoardRank.SIX;
    case 6: return BoardRank.SEVEN;
    case 7: return BoardRank.EIGHT;
    default: throw new Error(`Invalid value: ${index}`);
  }
}
