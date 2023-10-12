import { BoardFile } from './BoardFile';
import { BoardRank } from './BoardRank';

export class BoardPosition {
  public readonly file: BoardFile;
  public readonly rank: BoardRank;
  public constructor(file: BoardFile, rank: BoardRank) {
    this.file = file;
    this.rank = rank;
  }
}
