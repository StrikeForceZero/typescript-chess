import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { BoardPosition } from '../../board/BoardPosition';
import { Square } from '../../board/BoardPositionIdentifer';
import { deserialize } from '../../fen/deserializer';
import { deserializerWithStatus } from '../../fen/deserializerWithStatus';
import {
  FENString,
  StandardStartPositionFEN,
} from '../../fen/FENString';
import {
  BlackPawn,
  WhitePawn,
} from '../../piece/ChessPiece';
import { CaptureType } from '../CaptureType';
import {
  DiagonalDirection,
  Direction,
  toDirection,
} from '../direction';
import {
  ExecutableMove,
  executableMove,
} from '../ExecutableMove';
import { MoveData } from '../MoveData';
import { MoveType } from '../MoveType';
import { getValidMoves } from '../utils/MoveUtils';

function stripExec(executableMove: ExecutableMove): Omit<ExecutableMove, 'exec' | 'tryExec'> {
  const {
    exec: _exec,
    tryExec: _tryExec,
    ...rest
  } = executableMove;
  return {
    ...rest,
  };
}

function executableMoveWithoutExec(...args: Parameters<typeof executableMove>): ReturnType<typeof stripExec> {
  return stripExec(executableMove(...args));
}

describe('moves', () => {
  describe('getValidMoves', () => {
    const getNewGameState = () => deserialize(StandardStartPositionFEN);
    it('should handle knight attack', () => {
      const moveData: MoveData = {
        moveType: MoveType.LJump,
        sourcePos: BoardPosition.fromString('b1'),
        direction: [Direction.North, Direction.East],
        moveMeta: {
          onlyFinalPositionIsValid: true,
          ignoresBlockingPieces: true,
          capture: CaptureType.CanCapture,
          directionLimit: [2, 1],
        },
      };
      const gs = getNewGameState();
      const targetSquare = BoardPosition.fromString('c3');
      gs.board.placePieceFromPos(BlackPawn, targetSquare);
      const moves = getValidMoves(gs, moveData).map(stripExec);
      expect(moves).toStrictEqual([executableMoveWithoutExec(moveData.sourcePos, targetSquare, targetSquare)]);
    });
    it('should handle knight off board', () => {
      const moveData: MoveData = {
        moveType: MoveType.LJump,
        sourcePos: BoardPosition.fromString('b1'),
        direction: [Direction.South, Direction.East],
        moveMeta: {
          onlyFinalPositionIsValid: true,
          ignoresBlockingPieces: true,
          capture: CaptureType.CanCapture,
          directionLimit: [2, 1],
        },
      };
      const gs = getNewGameState();
      const moves = getValidMoves(gs, moveData).map(stripExec);
      expect(moves).toStrictEqual([]);
    });
    it('should handle pawn attack', () => {
      const moveData: MoveData = {
        moveType: MoveType.PawnAttack,
        sourcePos: BoardPosition.fromString('b2'),
        direction: toDirection(DiagonalDirection.NorthEast),
        moveMeta: {
          capture: CaptureType.CaptureOnly,
          directionLimit: 1,
        },
      };
      const gs = getNewGameState();
      const targetSquare = BoardPosition.fromString('c3');
      gs.board.placePieceFromPos(BlackPawn, targetSquare);
      const moves = getValidMoves(gs, moveData).map(stripExec);
      expect(moves).toStrictEqual([executableMoveWithoutExec(moveData.sourcePos, targetSquare, targetSquare)]);
    });
    it('should handle pawn blocked', () => {
      const moveData: MoveData = {
        moveType: MoveType.Forward,
        sourcePos: BoardPosition.fromString('c3'),
        direction: Direction.North,
        moveMeta: {
          capture: CaptureType.None,
          directionLimit: 1,
        },
      };
      const gs = getNewGameState();
      const targetSquare = BoardPosition.fromString('c3');
      gs.board.placePieceFromPos(WhitePawn, targetSquare);
      gs.board.placePieceFromPos(BlackPawn, BoardPosition.fromString('c4'));
      const moves = getValidMoves(gs, moveData).map(stripExec);
      expect(moves).toStrictEqual([]);
    });
    it('should handle pawn enpassant', () => {
      const moveData: MoveData = {
        moveType: MoveType.PawnAttack,
        sourcePos: BoardPosition.fromString('c4'),
        direction: Direction.SouthWest,
        moveMeta: {
          capture: CaptureType.CaptureOnly,
          directionLimit: 1,
        },
      };
      const gs = deserialize('rnbqkbnr/pp1ppppp/8/8/1Pp5/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1' as FENString);
      const moves = getValidMoves(gs, moveData).map(stripExec);
      const targetPos = BoardPosition.fromString('b3');
      const capturePos = BoardPosition.fromString('b4');
      expect(moves).toStrictEqual([executableMoveWithoutExec(moveData.sourcePos, targetPos, capturePos)]);
    });
    it('should handle castle', () => {
      const moveData: MoveData = {
        moveType: MoveType.Castle,
        sourcePos:BoardPosition.fromTuple(Square.WhiteKing),
        direction: Direction.East,
        moveMeta: {
          capture: CaptureType.None,
          directionLimit: 2,
          onlyFromStartingPos: true,
        },
      };
      const gs = deserializerWithStatus('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1' as FENString, true);
      const moves = getValidMoves(gs, moveData).map(stripExec);
      const targetPos = BoardPosition.fromTuple(Square.WhiteKingSideKnight);
      expect(moves).toStrictEqual([executableMoveWithoutExec(moveData.sourcePos, targetPos)]);
    });
    it('should not performCastle because move puts king in check', () => {
      const moveData: MoveData = {
        moveType: MoveType.Castle,
        sourcePos:BoardPosition.fromTuple(Square.WhiteKing),
        direction: Direction.East,
        moveMeta: {
          capture: CaptureType.None,
          directionLimit: 2,
          onlyFromStartingPos: true,
        },
      };
      const gs = deserializerWithStatus('rnbqkbn1/ppppppp1/8/8/8/8/PPPPPrPP/RNBQK2R w KQq - 0 1' as FENString, true);
      const moves = getValidMoves(gs, moveData).map(stripExec);
      expect(moves).toStrictEqual([]);
    });
  });
});
