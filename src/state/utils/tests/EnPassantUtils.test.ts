import {
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { BoardPosition } from '../../../board/BoardPosition';
import { deserialize } from '../../../fen/deserializer';
import {
  FENString,
  StandardStartPositionFEN,
} from '../../../fen/FENString';
import { PieceColor } from '../../../piece/PieceColor';
import { GameState } from '../../GameState';
import {
  getEnPassantCaptureData,
  getEnPassantSquareFromMove,
} from '../EnPassantUtils';

describe('EnPassantUtils', () => {
  describe('getEnPassantCaptureData', () => {
    let gameState = new GameState();

    beforeEach(() => {
      gameState = deserialize('rnbqkbnr/pppp1ppp/8/4pP2/8/8/PPPPP1PP/RNBQKBNR w KQkq e6 0 1' as FENString);
    });

    it('should get data', () => {
      expect(getEnPassantCaptureData(gameState)).toStrictEqual({
        attackFromPos: [ BoardPosition.fromString('f5') ],
        capturePos: BoardPosition.fromString('e5'),
        finalPos: BoardPosition.fromString('e6'),
      });
    });
    it('should not get data (and not throw)', () => {
      expect(getEnPassantCaptureData(gameState, PieceColor.Black)).toBe(undefined);
    });
    it('should not get data (and throw)', () => {
      gameState.activeColor = PieceColor.Black;
      expect(() => getEnPassantCaptureData(gameState, PieceColor.Black)).toThrow();
    });
  });

  describe('getEnPassantSquareFromMove', () => {
    let gameState = new GameState();

    beforeEach(() => {
      gameState = deserialize(StandardStartPositionFEN);
    });

    it('shouldSetEnPassantSquareFromMove (white)', () => {
      const enPassantTargetSquare = getEnPassantSquareFromMove(gameState.board, BoardPosition.fromString('e2'), BoardPosition.fromString('e4'));
      expect(enPassantTargetSquare).toStrictEqual(BoardPosition.fromString('e3'));
    });
    it('shouldSetEnPassantSquareFromMove (black)', () => {
      const enPassantTargetSquare = getEnPassantSquareFromMove(gameState.board, BoardPosition.fromString('e7'), BoardPosition.fromString('e5'));
      expect(enPassantTargetSquare).toStrictEqual(BoardPosition.fromString('e6'));
    });
  });
});
