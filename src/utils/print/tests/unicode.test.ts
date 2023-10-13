import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { deserialize } from '../../../fen/deserializer';
import { StandardStartPositionFEN } from '../../../fen/FENString';
import { boardToUnicode } from '../unicode';

describe('unicode', () => {
  it('should print board in Unicode', () => {
    const gameState = deserialize(StandardStartPositionFEN);
    const unicodeBoard = boardToUnicode(gameState.board);
    expect(unicodeBoard).toStrictEqual([
      ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
      ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
      ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
    ]);
  });
});

