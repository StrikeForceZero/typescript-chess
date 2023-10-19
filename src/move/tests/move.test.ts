import {
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { BoardPosition } from '../../board/BoardPosition';
import { deserialize } from '../../fen/deserializer';
import { StandardStartPositionFEN } from '../../fen/FENString';
import { serialize } from '../../fen/serialize';
import {
  BlackKing,
  BlackPawn,
  ChessPieceColored,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
} from '../../piece/ChessPiece';
import { GameStatus } from '../../state/GameStatus';
import { move } from '../move';

describe('move', () => {
  let gameState = deserialize(StandardStartPositionFEN);
  beforeEach(() => {
    gameState = deserialize(StandardStartPositionFEN);
  });
  function moveAndValidate(fromPos: string, toPos: string, expectedPiece: ChessPieceColored) {
    const from = BoardPosition.fromString(fromPos);
    const to = BoardPosition.fromString(toPos);
    move(gameState, from, to);
    expect(gameState.board.getPieceFromPos(to)).toStrictEqual(expectedPiece);
  }
  it('should handle simple move', () => {
    moveAndValidate('b1', 'c3', WhiteKnight);
  });
  // TODO: this is more of an e2e test
  it('should handle wrong color move', () => {
    moveAndValidate('e2', 'e4', WhitePawn);
    // wrong color
    expect(() => moveAndValidate('d1', 'h5', WhiteQueen)).toThrow();
  });
  it('should handle capture move', () => {
    moveAndValidate('e2', 'e4', WhitePawn);
    moveAndValidate('f7', 'f5', BlackPawn);
    moveAndValidate('d1', 'g4', WhiteQueen);
    moveAndValidate('f5', 'g4', BlackPawn);
  });
  it('should handle check', () => {
    moveAndValidate('e2', 'e4', WhitePawn);
    moveAndValidate('f7', 'f5', BlackPawn);
    moveAndValidate('d1', 'h5', WhiteQueen);
    expect(gameState.gameStatus).toBe(GameStatus.Check);
    // should fail because this move does not get us out of check
    expect(() => moveAndValidate('e8', 'f7', BlackKing)).toThrow();
    // double check state and make sure pieces were reverted
    expect(serialize(gameState)).toBe('rnbqkbnr/ppppp1pp/8/5p1Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2');
    // should pass because we are blocking the check
    moveAndValidate('g7', 'g6', BlackPawn);
    expect(gameState.gameStatus).toBe(GameStatus.InProgress);
  });
});
