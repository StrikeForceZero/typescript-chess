import { Board } from './Board';
import {
  BoardFile,
  fromIndex as boardFileFromIndex,
  toIndex as boardFileToIndex,
} from './BoardFile';
import {
  BoardRank,
  fromIndex as boardRankFromIndex,
  toIndex as boardRankToIndex,
} from './BoardRank';
import { BoardSquare } from './BoardSquare';

export class BoardSquareIterator implements Iterator<BoardSquare> {
  private fileIndex = 0;
  private rankIndex = 0;
  private readonly board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  next(): IteratorResult<BoardSquare> {
    if (this.rankIndex > boardRankToIndex(BoardRank.EIGHT)) {
      return {
        done: true,
        value: null,
      };
    }

    const square = this.board.getSquare(boardFileFromIndex(this.fileIndex), boardRankFromIndex(this.rankIndex));

    this.fileIndex++;
    if (this.fileIndex > boardFileToIndex(BoardFile.H)) {
      this.fileIndex = 0;
      this.rankIndex++;
    }

    return {
      done: false,
      value: square,
    };
  }
}
