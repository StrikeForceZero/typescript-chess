import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { Board } from '../../../board/Board';
import { BoardPosition } from '../../../board/BoardPosition';
import { Square } from '../../../board/BoardPositionIdentifer';
import {
  deserialize,
  deserializeBoardOnlyFENString,
} from '../../../fen/deserializer';
import {
  FENString,
  StandardStartPositionBoardOnlyFEN,
} from '../../../fen/FENString';
import { serialize } from '../../../fen/serialize';
import { CastlingRights } from '../../CastlingRights';
import {
  loadInitialCastleRightsFromBoard,
  performCastle,
  updateCastleRights,
} from '../CastlingRightsUtils';

describe('CastlingRightsUtils', () => {
  const noCastleRights = new CastlingRights();
  noCastleRights.white.queenSide = false;
  noCastleRights.white.kingSide = false;
  noCastleRights.black.queenSide = false;
  noCastleRights.black.kingSide = false;
  describe('updateCastleRights', () => {
    it('should updateCastleRights', () => {
      const castleRights = new CastlingRights();
      const board = deserializeBoardOnlyFENString(StandardStartPositionBoardOnlyFEN);
      updateCastleRights(board, castleRights);
      expect(castleRights).toStrictEqual(new CastlingRights());
      board.removePieceFromPos(BoardPosition.fromTuple(Square.WhiteQueenSideRook));
      updateCastleRights(board, castleRights);
      expect(castleRights.white.queenSide).toBe(false);
      board.removePieceFromPos(BoardPosition.fromTuple(Square.WhiteKingSideRook));
      updateCastleRights(board, castleRights);
      expect(castleRights.white.kingSide).toBe(false);
      board.removePieceFromPos(BoardPosition.fromTuple(Square.BlackKing));
      updateCastleRights(board, castleRights);
      expect(castleRights.black.kingSide).toBe(false);
      expect(castleRights.black.queenSide).toBe(false);
      expect(castleRights).toStrictEqual(noCastleRights);
    });
  });
  describe('loadInitialCastleRightsFromBoard', () => {
    it('should loadInitialCastleRightsFromBoard', () => {
      expect(loadInitialCastleRightsFromBoard(new Board())).toStrictEqual(noCastleRights);
      expect(loadInitialCastleRightsFromBoard(deserializeBoardOnlyFENString(StandardStartPositionBoardOnlyFEN))).toStrictEqual(new CastlingRights());
    });
  });
  describe('performCastle', () => {
    it('should performCastle', () => {
      const gameState = deserialize('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1' as FENString);
      performCastle(gameState.board, BoardPosition.fromTuple(Square.WhiteKing), BoardPosition.fromTuple(Square.WhiteKingSideKnight));
      // performCastle does not update state so active color, and castling rights should remain the same
      expect(serialize(gameState)).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1RK1 w KQkq - 0 1');
    });
  });
});
