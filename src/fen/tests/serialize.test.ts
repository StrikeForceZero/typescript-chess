import {
  describe,
  expect,
  test,
} from '@jest/globals';
import { Board } from '../../board/Board';
import { BoardFile } from '../../board/BoardFile';
import { BoardPosition } from '../../board/BoardPosition';
import { BoardRank } from '../../board/BoardRank';
import { GameState } from '../../state/GameState';
import { deserialize } from '../deserializer';
import {
  EmptyBoardOnlyFEN,
  FENString,
  StandardStartPositionBoardOnlyFEN,
  StandardStartPositionFEN,
} from '../FENString';
import {
  serialize,
  serializeBoardOnlyFENString,
} from '../serialize';

describe('FEN serialize', () => {
  test('serializes empty state', () => {
    const serialized = serialize(new GameState());
    expect(serialized).toBe('8/8/8/8/8/8/8/8 w KQkq - 0 1');
  });
  test('serializes initial state', () => {
    const gameState = deserialize(StandardStartPositionFEN);
    const serialized = serialize(gameState);
    expect(serialized).toBe(StandardStartPositionFEN);
  });
  test('serializes en-passant', () => {
    const targetSquare = new BoardPosition(BoardFile.A, BoardRank.ONE);
    const gameState = new GameState();
    gameState.enPassantTargetSquare = targetSquare;
    const enPassantFen = `8/8/8/8/8/8/8/8 w KQkq ${targetSquare} 0 1` as FENString;
    const serialized = serialize(gameState);
    expect(serialized).toBe(enPassantFen);
  });
  test('serializes castling rights', () => {
    const gameState = new GameState();
    expect(serialize(gameState)).toBe('8/8/8/8/8/8/8/8 w KQkq - 0 1');
    gameState.castlingRights.black.kingSide = false;
    expect(serialize(gameState)).toBe('8/8/8/8/8/8/8/8 w KQq - 0 1');
    gameState.castlingRights.black.queenSide = false;
    expect(serialize(gameState)).toBe('8/8/8/8/8/8/8/8 w KQ - 0 1');
    gameState.castlingRights.white.queenSide = false;
    expect(serialize(gameState)).toBe('8/8/8/8/8/8/8/8 w K - 0 1');
    gameState.castlingRights.white.kingSide = false;
    expect(serialize(gameState)).toBe('8/8/8/8/8/8/8/8 w - - 0 1');
  });
  test('serializes just board', () => {
    expect(serializeBoardOnlyFENString(new Board())).toBe(EmptyBoardOnlyFEN);
    expect(serializeBoardOnlyFENString(deserialize(StandardStartPositionFEN).board)).toStrictEqual(StandardStartPositionBoardOnlyFEN);
  });
});
