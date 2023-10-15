import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { BoardPosition } from '../../board/BoardPosition';
import { deserialize } from '../../fen/deserializer';
import { StandardStartPositionFEN } from '../../fen/FENString';
import { BlackPawn } from '../../piece/ChessPiece';
import {
  DiagonalDirection,
  Direction,
  toDirection,
} from '../direction';
import {
  getValidMoves,
  MoveData,
} from '../moves';

describe('moves', () => {
  const getNewGameState = () => deserialize(StandardStartPositionFEN);
  it('should getValidMoves knight attack', () => {
    const moveData: MoveData = {
      sourcePos: BoardPosition.fromString('b1'),
      direction: [Direction.North, Direction.East],
      moveMeta: {
        onlyFinalPositionIsValid: true,
        ignoresBlockingPieces: true,
        capture: true,
        directionLimit: [2, 1],
      },
    };
    const gs = getNewGameState();
    const targetSquare = BoardPosition.fromString('c3');
    gs.board.placePieceFromPos(BlackPawn, targetSquare);
    const moves = getValidMoves(gs, moveData);
    expect(moves).toStrictEqual([ { piece: BlackPawn, pos: targetSquare } ]);
  });
  it('should getValidMoves knight off board', () => {
    const moveData: MoveData = {
      sourcePos: BoardPosition.fromString('b1'),
      direction: [Direction.South, Direction.East],
      moveMeta: {
        onlyFinalPositionIsValid: true,
        ignoresBlockingPieces: true,
        capture: true,
        directionLimit: [2, 1],
      },
    };
    const gs = getNewGameState();
    const moves = getValidMoves(gs, moveData);
    expect(moves).toStrictEqual([]);
  });
  it('should getValidMoves pawn attack', () => {
    const moveData: MoveData = {
      sourcePos: BoardPosition.fromString('b2'),
      direction: toDirection(DiagonalDirection.NorthEast),
      moveMeta: {
        capture: true,
        directionLimit: 1,
      },
    };
    const gs = getNewGameState();
    const targetSquare = BoardPosition.fromString('c3');
    gs.board.placePieceFromPos(BlackPawn, targetSquare);
    const moves = getValidMoves(gs, moveData);
    expect(moves).toStrictEqual([ { piece: BlackPawn, pos: targetSquare } ]);
  });
  it('should getValidMoves pawn blocked', () => {
    const moveData: MoveData = {
      sourcePos: BoardPosition.fromString('c3'),
      direction: Direction.North,
      moveMeta: {
        directionLimit: 1,
      },
    };
    const gs = getNewGameState();
    const targetSquare = BoardPosition.fromString('c3');
    gs.board.placePieceFromPos(BlackPawn, targetSquare);
    const moves = getValidMoves(gs, moveData);
    expect(moves).toStrictEqual([]);
  });
});
