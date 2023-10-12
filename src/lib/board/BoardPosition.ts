import {
  BoardFile,
  fromChar as boardFileFromChar,
} from './BoardFile';
import {
  BoardRank,
  fromChar as boardRankFromChar,
} from './BoardRank';

export class BoardPosition {
  public readonly file: BoardFile;
  public readonly rank: BoardRank;
  public constructor(file: BoardFile, rank: BoardRank) {
    this.file = file;
    this.rank = rank;
  }

  public static fromString(str: string): BoardPosition {
    if (str.length !== 2) {
      throw new Error(`'${str}' is not an expected str length of 2`);
    }
    const [rawFile, rawRank] = str.split('');
    return new BoardPosition(boardFileFromChar(rawFile!), boardRankFromChar(rawRank!));
  }
}
