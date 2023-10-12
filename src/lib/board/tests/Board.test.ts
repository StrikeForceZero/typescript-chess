import {
  describe,
  expect,
  test,
  beforeEach,
} from '@jest/globals';
import {
  BlackKing,
  NoPiece,
  WhiteKing,
} from '../../piece/ChessPiece';
import { Board } from '../Board';
import { BoardFile } from '../BoardFile';
import { BoardRank } from '../BoardRank';

class BoardWrapper extends Board {
  public getSquares() {
    return this.squares;
  }

  public static override initializeSquares() {
    return Board.initializeSquares();
  }
}

describe('Board', () => {
  let board: Board;
  const piece = WhiteKing;
  beforeEach(() => {
    board = new Board();
    board.placePiece(piece, BoardFile.A, BoardRank.ONE);
  });
  test('should initialize squares', () => {
    const board = new BoardWrapper();
    expect(board.getSquares()).toEqual(BoardWrapper.initializeSquares())
    expect(board.getSquares().length).toBe(8);
    expect(board.getSquares().every(rank => rank.length === 8)).toBe(true);
    expect(Array.from(board).every(sq => sq.piece === NoPiece)).toBe(true);

    const square = board.getSquare(BoardFile.A, BoardRank.ONE);
    expect(square.pos.file).toBe(BoardFile.A);
    expect(square.pos.rank).toBe(BoardRank.ONE); // failing here
  });
  test('should place piece', () => {
    const piece2 = BlackKing;
    board.placePiece(piece2, BoardFile.A, BoardRank.ONE);
    expect(board.getPiece(BoardFile.A, BoardRank.ONE)).toBe(piece2);
  });
  test('should get piece', () => {
    expect(board.getPiece(BoardFile.A, BoardRank.ONE)).toBe(piece);
  });
  test('should remove piece', () => {
    expect(board.getPiece(BoardFile.A, BoardRank.ONE)).toBe(piece);
    board.removePiece(BoardFile.A, BoardRank.ONE);
    expect(board.getPiece(BoardFile.A, BoardRank.ONE)).toBe(NoPiece);
  });
  test('should clear', () => {
    expect(board.getPiece(BoardFile.A, BoardRank.ONE)).toBe(piece);
    board.clear();
    expect(board.getPiece(BoardFile.A, BoardRank.ONE)).toBe(NoPiece);
  });
});
