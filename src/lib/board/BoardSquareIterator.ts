import { Board } from './Board';
import {
  BoardFile,
  fromNumber as boardFileFromNumber,
} from './BoardFile';
import {
  BoardRank,
  fromIndex as boardRankFromIndex,
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
    if (boardRankFromIndex(this.rankIndex) === BoardRank.EIGHT) {
      return { done: true, value: null };
    }

    const square = this.board.getSquare(boardFileFromIndex(this.fileIndex), boardRankFromIndex(this.rankIndex));

    this.fileIndex++;
    if (boardFileFromNumber(this.fileIndex) === BoardFile.H) {
      this.fileIndex = 0;
      this.rankIndex++;
    }

    return { done: false, value: square };
  }
}