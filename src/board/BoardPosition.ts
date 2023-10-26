import { charTuple } from '../utils/char';
import {
  BoardFile,
  fromCharUnchecked as boardFileFromCharUnchecked,
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
    const [rawFile, rawRank] = charTuple(str);
    return new BoardPosition(boardFileFromCharUnchecked(rawFile), boardRankFromChar(rawRank));
  }

  public static fromTuple([file, rank]: readonly [file: BoardFile, rank: BoardRank]): BoardPosition {
    return new BoardPosition(file, rank);
  }

  public toString(): string {
    return this.file + this.rank;
  }

  public toTuple(): [file: BoardFile, rank: BoardRank] {
    return [this.file, this.rank];
  }

  // TODO: alternatively we could create a full map of the board and have the constructor return that instance if one exists.
  public isEqual(pos: BoardPosition): boolean {
    return this.toString() == pos.toString();
  }
}
