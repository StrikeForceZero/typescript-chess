import { Option } from '../utils/Option';
import { BoardSquareIterator } from './BoardSquareIterator';
import { BoardPosition } from './BoardPosition';
import { ChessPiece } from '../piece/ChessPiece';
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
  protected readonly squares: readonly (readonly BoardSquare[])[] = Board.initializeSquares();

  protected static initializeSquares(): BoardSquare[][] {
    const squares: BoardSquare[][] = [];
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
        square.piece = Option.None();
      }
    }
  }

  // Get square at a particular position (if you need more information than just the piece)
  public getSquare(file: BoardFile, rank: BoardRank): BoardSquare {
    return this.squares[boardRankToIndex(rank)]![boardFileToIndex(file)]!;
  }

  public setPiece(piece: Option<ChessPiece>, file: BoardFile, rank: BoardRank): void {
    this.getSquare(file, rank).piece = piece;
  }

  // Place a piece on the board
  public placePiece(piece: ChessPiece, file: BoardFile, rank: BoardRank): void {
    this.getSquare(file, rank).piece = Option.Some(piece);
  }

  // Remove a piece from the board and return it
  public removePiece(file: BoardFile, rank: BoardRank): Option<ChessPiece> {
    const square = this.getSquare(file, rank);
    const piece = square.piece;
    square.piece = Option.None();
    return piece;
  }

  public removePieceOrThrow(file: BoardFile, rank: BoardRank): ChessPiece {
    const removedPiece = this.removePiece(file, rank);
    if (!removedPiece.isSome()) {
      throw new Error(`expected piece to be at ${file}${rank}`);
    }
    return removedPiece.value;
  }


  // Get piece at a particular position
  public getPiece(file: BoardFile, rank: BoardRank): Option<ChessPiece> {
    return this.getSquare(file, rank).piece;
  }

  public getPieceOrThrow(file: BoardFile, rank: BoardRank): ChessPiece {
    const piece = this.getPiece(file, rank);
    if (!piece.isSome()) {
      throw new Error(`no piece found at ${file}${rank}`);
    }
    return piece.value;
  }

  /* using board position */

  // Get square at a particular position (if you need more information than just the piece)
  public getSquareFromPos(pos: BoardPosition): BoardSquare {
    return this.getSquare(pos.file, pos.rank);
  }

  public setPieceFromPos(piece: Option<ChessPiece>, pos: BoardPosition): void {
    return this.setPiece(piece, pos.file, pos.rank);
  }

  // Place a piece on the board
  public placePieceFromPos(piece: ChessPiece, pos: BoardPosition): void {
    this.placePiece(piece, pos.file, pos.rank);
  }

  // Remove a piece from the board and return it
  public removePieceFromPos(pos: BoardPosition): Option<ChessPiece> {
    return this.removePiece(pos.file, pos.rank);
  }

  public removePieceFromPosOrThrow(pos: BoardPosition): ChessPiece {
    return this.removePieceOrThrow(pos.file, pos.rank);
  }

  // Get piece at a particular position
  public getPieceFromPos(pos: BoardPosition): Option<ChessPiece> {
    return this.getPiece(pos.file, pos.rank);
  }

  public getPieceFromPosOrThrow(pos: BoardPosition): ChessPiece {
    return this.getPieceOrThrow(pos.file, pos.rank);
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
