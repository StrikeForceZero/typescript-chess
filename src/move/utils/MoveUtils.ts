import { BoardFile } from '../../board/BoardFile';
import { BoardPosition } from '../../board/BoardPosition';
import { CastleSide } from '../../board/CastleSide';
import {
  boardScanner,
  BoardScannerResult,
  nextBoardPos,
} from '../../board/utils/BoardScanner';
import { isPieceAtStartingPos } from '../../board/utils/BoardUtils';
import { ChessPiece } from '../../piece/ChessPiece';
import { PieceType } from '../../piece/PieceType';
import { GameState } from '../../state/GameState';
import { GameStatus } from '../../state/GameStatus';
import {
  getCastleSideFromDirection,
  getValidCastleSides,
  mapCastleSideToTargetPosition,
  performCastle,
} from '../../state/utils/CastlingRightsUtils';
import { isCheck } from '../../state/utils/CheckUtils';
import { getEnPassantCaptureData } from '../../state/utils/EnPassantUtils';
import {
  ensureArray,
  isNotEmpty,
  last,
  sum,
} from '../../utils/array';
import { Option } from '../../utils/Option';
import { CaptureType } from '../CaptureType';
import {
  executableMove,
  ExecutableMove,
} from '../ExecutableMove';
import { MoveData } from '../MoveData';
import { MoveType } from '../MoveType';
import {
  extractDirectionAndLimitTuples,
  isDirectionTuple,
} from './MoveDataUtils';

export function isSameMoveFactory(fromPos: BoardPosition, toPos: BoardPosition) {
  return (move: ExecutableMove) => {
    return move.fromPos.isEqual(fromPos) && move.toPos.isEqual(toPos);
  };
}

// Helper function to determine if a move is blocked
function isMoveBlocked(result: BoardScannerResult, sourcePiece: ChessPiece, isAttack: boolean, ignoresBlockingPieces: boolean): boolean {
  if (!isAttack && !ignoresBlockingPieces && result.piece.isSome()) {
    return true;
  }
  if (!ignoresBlockingPieces && result.piece.isSome() && result.piece.value.color === sourcePiece.color) {
    return true;
  }
  return false;
}

// Helper function to handle the last move's conditions
function hasValidLastMove(moves: BoardScannerResult[], sourcePiece: ChessPiece, isAttack: boolean): boolean {
  if (isNotEmpty(moves)) {
    const lastMove = last(moves);
    const targetPiece = lastMove.piece;
    if (targetPiece.isSome()) {
      // if attacking and target piece is different color
      if (isAttack && targetPiece.value.color !== sourcePiece.color) {
        return true;
      }
      // cant attack same color / cant move to an occupied square
      return false;
    }
    // empty square
    return true;
  }
  // moves was empty
  return false;
}

function isValidCapture(movingPiece: ChessPiece, scannerResult: BoardScannerResult, captureType: CaptureType): boolean {
  if (captureType === CaptureType.CaptureOnly) {
    if (scannerResult.piece.isSome() && scannerResult.piece.value.color !== movingPiece.color) {
      // can capture
      return true;
    }
    // cant capture same color or move to empty square
    return false;
  }
  if (captureType === CaptureType.CanCapture) {
    if (scannerResult.piece.isSome()) {
      if (scannerResult.piece.value.color !== movingPiece.color) {
        // can capture
        return true;
      }
      // cant capture same color
      return false;
    }
    // can still move to empty square
    return true;
  }
  if (captureType === CaptureType.None) {
    if (scannerResult.piece.isSome()) {
      // cant capture anything
      return false;
    }
    // can still move to empty square
    return true;
  }
  throw new Error(`not implemented for (moveData.moveMeta.capture) ${CaptureType[captureType]}`);
}

export function getValidMoves(gameState: GameState, moveData: MoveData): ExecutableMove[] {
  const shouldStopOnPiece = !moveData.moveMeta.ignoresBlockingPieces;
  const directionsWithLimits = extractDirectionAndLimitTuples(moveData);
  const sourcePiece = gameState.board.getPieceFromPosOrThrow(moveData.sourcePos);
  let moves: BoardScannerResult[] = [];
  let lastPos = moveData.sourcePos;

  // for pawn double moves and castling
  if (!!moveData.moveMeta.onlyFromStartingPos && !isPieceAtStartingPos(gameState.board, moveData.sourcePos)) {
    return [];
  }

  // EnPassant handling
  if (moveData.moveType === MoveType.PawnAttack) {

    const enPassantCaptureData = getEnPassantCaptureData(gameState, sourcePiece.color);
    if (enPassantCaptureData) {
      if (enPassantCaptureData.attackFromPos.find(pos => pos.isEqual(moveData.sourcePos))) {
        if (isDirectionTuple(moveData.direction)) {
          throw new Error('bad move data');
        }
        if (nextBoardPos(moveData.sourcePos, moveData.direction)?.isEqual(enPassantCaptureData.finalPos)) {
          return [executableMove(moveData.sourcePos, enPassantCaptureData.finalPos, enPassantCaptureData.capturePos)];
        }
      }
    }
  }

  // TODO: this feels weird
  if (moveData.moveType === MoveType.Castle) {
    if (gameState.gameStatus === GameStatus.Check || gameState.gameStatus === GameStatus.Checkmate) {
      // cant castle in check
      return [];
    }
    // TODO: find better way to handle this
    const direction = moveData.direction;
    if (isDirectionTuple(direction)) {
      throw new Error('bad move data');
    }
    const castleSides = getValidCastleSides(gameState.board, gameState.castlingRights, moveData.sourcePos);
    const side = castleSides.find(side => getCastleSideFromDirection(direction) === side);
    if (!side) {
      return [];
    }
    const targetPos = mapCastleSideToTargetPosition(side, moveData.sourcePos);
    for (const scanResult of boardScanner(gameState.board, moveData.sourcePos, direction, { stopOnPiece: true })) {
      const gameStateClone = gameState.clone();
      gameStateClone.board.setPieceFromPos(gameStateClone.board.removePieceFromPos(moveData.sourcePos), scanResult.pos);
      if (isCheck(gameStateClone, true, sourcePiece.color)) {
        // can't castle if the move to the final position would put the king in check
        return [];
      }
    }
    return [executableMove(moveData.sourcePos, targetPos, undefined, (gameState, fromPos, toPos) => performCastle(gameState.board, fromPos, toPos))];
  }

  outer: for (const [direction, limit] of directionsWithLimits) {
    const scanner = boardScanner(gameState.board, lastPos, direction, { stopOnPiece: shouldStopOnPiece, limit: limit });
    for (const result of scanner) {
      if (isMoveBlocked(result, sourcePiece, !!moveData.moveMeta.capture, !!moveData.moveMeta.ignoresBlockingPieces)) {
        break outer;
      }
      lastPos = result.pos;
      moves.push(result);
    }
  }

  if (!hasValidLastMove(moves, sourcePiece, moveData.moveMeta.capture !== CaptureType.None)) {
    moves.pop();
  }

  // TODO: this is similar to hasValidLastMove but cant work for LJump
  if (!moveData.moveMeta.onlyFinalPositionIsValid) {
    moves = moves.filter(move => isValidCapture(sourcePiece, move, moveData.moveMeta.capture));
  }

  if (isNotEmpty(moves) && moveData.moveMeta.onlyFinalPositionIsValid) {
    const lastMoveIx = sum(ensureArray(moveData.moveMeta.directionLimit)) - 1;
    const lastMove = moves[lastMoveIx];
    let expectedCapturePos = undefined;
    if (lastMove) {
      expectedCapturePos = lastMove.piece.isSome() ? lastMove.pos : undefined;
      return [executableMove(moveData.sourcePos, lastMove.pos, expectedCapturePos)];
    }
    return [];
  }

  return moves.map(move => {
    const expectedCapturePos = move.piece.isSome() ? move.pos : undefined;
    return executableMove(moveData.sourcePos, move.pos, expectedCapturePos);
  });
}

export function looksLikeCastleMove(piece: PieceType, from: BoardPosition, to: BoardPosition): Option<CastleSide> {
  if (piece !== PieceType.King) {
    return Option.None();
  }
  if (from.file === BoardFile.E) {
    if (to.file === BoardFile.G) {
      return Option.Some(CastleSide.KingSide);
    }
    if (to.file === BoardFile.C) {
      return Option.Some(CastleSide.QueenSide);
    }
  }
  return Option.None();
}
