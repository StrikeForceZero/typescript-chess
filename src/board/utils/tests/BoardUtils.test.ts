import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { deserializeBoardOnlyFENString } from '../../../fen/deserializer';
import { StandardStartPositionBoardOnlyFEN } from '../../../fen/FENString';
import { Board } from '../../Board';
import { BoardPosition } from '../../BoardPosition';
import {
  isBoardAtStartingPos,
  isPieceAtStartingPos,
} from '../BoardUtils';

describe('BoardUtils', () => {
  it('should handle isBoardAtStartingPos', () => {
    expect(isBoardAtStartingPos(new Board())).toBe(false);
    expect(isBoardAtStartingPos(deserializeBoardOnlyFENString(StandardStartPositionBoardOnlyFEN))).toBe(true);
  });
  it('should handle isPieceAtStartingPos', () => {
    const board = deserializeBoardOnlyFENString(StandardStartPositionBoardOnlyFEN);
    expect(isPieceAtStartingPos(board, BoardPosition.fromString('a1'))).toBe(true);
    expect(isPieceAtStartingPos(board, BoardPosition.fromString('a3'))).toBe(true);
    expect(isPieceAtStartingPos(new Board(), BoardPosition.fromString('a1'))).toBe(false);
  });
});
