import {
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
import { serialize } from '../../../fen/serialize';
import { performMove } from '../../../move/performMove';
import { performCastle } from '../CastlingRightsUtils';
import {
  isThreefoldRepetition,
  stateOccurrenceCount,
} from '../GameStatusUtils';

describe('GameStatusUtils', () => {
  it('should report when isThreefoldRepetition correctly (quickest)', () => {
    const gameState = deserialize(StandardStartPositionFEN);
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // out
    performMove(gameState, BoardPosition.fromString('b1'), BoardPosition.fromString('c3'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('b8'), BoardPosition.fromString('c6'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // in
    performMove(gameState, BoardPosition.fromString('c3'), BoardPosition.fromString('b1'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('c6'), BoardPosition.fromString('b8'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(2);

    // out
    performMove(gameState, BoardPosition.fromString('b1'), BoardPosition.fromString('c3'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('b8'), BoardPosition.fromString('c6'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(2);

    //in
    performMove(gameState, BoardPosition.fromString('c3'), BoardPosition.fromString('b1'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('c6'), BoardPosition.fromString('b8'));
    expect(isThreefoldRepetition(gameState)).toBe(true);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(3);
  });

  it('should report when isThreefoldRepetition correctly', () => {
    const gameState = deserialize(StandardStartPositionFEN);
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // out
    performMove(gameState, BoardPosition.fromString('b1'), BoardPosition.fromString('c3'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('b8'), BoardPosition.fromString('c6'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // in
    performMove(gameState, BoardPosition.fromString('c3'), BoardPosition.fromString('b1'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('c6'), BoardPosition.fromString('b8'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(2);

    // out
    performMove(gameState, BoardPosition.fromString('g1'), BoardPosition.fromString('f3'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('g8'), BoardPosition.fromString('f6'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // in
    performMove(gameState, BoardPosition.fromString('f3'), BoardPosition.fromString('g1'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('f6'), BoardPosition.fromString('g8'));
    expect(isThreefoldRepetition(gameState)).toBe(true);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(3);
  });

  it('should report when isThreefoldRepetition (castling)', () => {
    const gameState = deserialize('rnbqk2r/ppppp2p/8/8/8/8/PPPPP2P/RNBQK2R w KQkq - 0 1' as FENString);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // out
    performMove(gameState, BoardPosition.fromString('b1'), BoardPosition.fromString('c3'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('b8'), BoardPosition.fromString('c6'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // in
    performMove(gameState, BoardPosition.fromString('c3'), BoardPosition.fromString('b1'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('c6'), BoardPosition.fromString('b8'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(2);

    performMove(
      gameState,
      BoardPosition.fromString('e1'),
      BoardPosition.fromString('g1'),
      undefined,
      (
        gameState,
        fromPos,
        toPos,
      ) => performCastle(gameState.board, fromPos, toPos),
    );
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // out
    performMove(gameState, BoardPosition.fromString('b8'), BoardPosition.fromString('c6'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('b1'), BoardPosition.fromString('c3'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(1);

    // in
    performMove(gameState, BoardPosition.fromString('c6'), BoardPosition.fromString('b8'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('c3'), BoardPosition.fromString('b1'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(2);

    // out
    performMove(gameState, BoardPosition.fromString('b8'), BoardPosition.fromString('c6'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('b1'), BoardPosition.fromString('c3'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(2);

    // in
    performMove(gameState, BoardPosition.fromString('c6'), BoardPosition.fromString('b8'));
    expect(isThreefoldRepetition(gameState)).toBe(false);
    performMove(gameState, BoardPosition.fromString('c3'), BoardPosition.fromString('b1'));
    expect(isThreefoldRepetition(gameState)).toBe(true);
    expect(stateOccurrenceCount(gameState, serialize(gameState))).toBe(3);
  });
});
