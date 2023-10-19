import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { Board } from '../../../board/Board';
import { BoardPosition } from '../../../board/BoardPosition';
import { Square } from '../../../board/BoardPositionIdentifer';
import { deserializeBoardOnlyFENString } from '../../../fen/deserializer';
import { StandardStartPositionBoardOnlyFEN } from '../../../fen/FENString';
import { CastlingRights } from '../../CastlingRights';
import {
  loadInitialCastleRightsFromBoard,
  updateCastleRights,
} from '../CastlingRightsUtils';

describe('CastlingRightsUtils', () => {
  const noCastleRights = new CastlingRights();
  noCastleRights.white.queenSide = false;
  noCastleRights.white.kingSide = false;
  noCastleRights.black.queenSide = false;
  noCastleRights.black.kingSide = false;
  it('should loadInitialCastleRightsFromBoard', () => {
    expect(loadInitialCastleRightsFromBoard(new Board())).toStrictEqual(noCastleRights);
    expect(loadInitialCastleRightsFromBoard(deserializeBoardOnlyFENString(StandardStartPositionBoardOnlyFEN))).toStrictEqual(new CastlingRights());
  });
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
