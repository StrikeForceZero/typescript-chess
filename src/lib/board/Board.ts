import { BoardSquareIterator } from './BoardSquareIterator';
import { BoardPosition } from './BoardPosition';
import {
  ChessPiece,
  NoPiece,
} from '../piece/ChessPiece';
import {
  BoardRank,
  toIndex as boardRankToIndex,
} from './BoardRank';
import {
  BoardFile,
  toIndex as boardFileToIndex,
} from './BoardFile';
import { BoardSquare } from './BoardSquare';
import { boardFileGenerator } from './utils/BoardFileUtils';
import { boardRankGenerator } from './utils/BoardRankUtils';

export class Board {
  private readonly squares: readonly (readonly BoardSquare[])[] = Board.initializeSquares();

  private static initializeSquares() {
    const squares = [];
    for (const rank of boardRankGenerator()) {
      const row: BoardSquare[] = [];
      for (const file of boardFileGenerator()) {
        const pos = new BoardPosition(file, rank);
        row.push(new BoardSquare(pos));
      }
      squares.push(row);
    }
    return squares;
  }

  public clear(): void {
    for (const row of this.squares) {
      for (const square of row) {
        square.piece = NoPiece;
      }
    }
  }

  // Get square at a particular position (if you need more information than just the piece)
  public getSquare(file: BoardFile, rank: BoardRank): BoardSquare {
    return this.squares[boardRankToIndex(rank)]![boardFileToIndex(file)]!;
  }

  // Place a piece on the board
  public placePiece(piece: ChessPiece, file: BoardFile, rank: BoardRank): void {
    this.getSquare(file, rank).piece = piece;
  }

  // Remove a piece from the board and return it
  public removePiece(file: BoardFile, rank: BoardRank): ChessPiece {
    const square = this.getSquare(file, rank);
    const piece = square.piece;
    square.piece = NoPiece;
    return piece;
  }

  // Get piece at a particular position
  public getPiece(file: BoardFile, rank: BoardRank): ChessPiece {
    return this.getSquare(file, rank).piece;
  }

  /* using board position */

  // Get square at a particular position (if you need more information than just the piece)
  public getSquareFromPos(pos: BoardPosition): BoardSquare {
    return this.getSquare(pos.file, pos.rank);
  }

  // Place a piece on the board
  public placePieceFromPos(piece: ChessPiece, pos: BoardPosition): void {
    this.getSquareFromPos(pos).piece = piece;
  }

  // Remove a piece from the board and return it
  public removePieceFromPos(pos: BoardPosition): ChessPiece {
    const square = this.getSquareFromPos(pos);
    const piece = square.piece;
    square.piece = NoPiece;
    return piece;
  }

  // Get piece at a particular position
  public getPieceFromPos(pos: BoardPosition): ChessPiece {
    return this.getSquareFromPos(pos).piece;
  }

  /* iterator */
  [Symbol.iterator](): Iterator<BoardSquare> {
    return new BoardSquareIterator(this);
  }

  public *iterate() {
    for (const square of this) {
      yield square;
    }
  }
}
