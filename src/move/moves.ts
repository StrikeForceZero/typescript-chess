import { BoardPosition } from '../board/BoardPosition';
import {
  boardScanner,
  BoardScannerResult,
} from '../board/utils/BoardScanner';
import {
  getChessPieceColoredOrThrow,
  isPieceAtStartingPos,
} from '../board/utils/BoardUtils';
import {
  ChessPiece,
  ChessPieceColored,
  isColoredPieceContainer,
  NoPiece,
} from '../piece/ChessPiece';
import { GameState } from '../state/GameState';
import {
  getCastleSideFromDirection,
  getValidCastleSides,
  mapCastleSideToTargetPosition,
  performCastle,
} from '../state/utils/CastlingRightsUtils';
import { getEnPassantCaptureData } from '../state/utils/EnPassantUtils';
import {
  ensureArray,
  isNotEmpty,
  last,
  sum,
} from '../utils/array';
import { Result } from '../utils/Result';
import { zipExact } from '../utils/zip';
import { Direction } from './direction';
import {
  AlternateMoveHandler,
  MoveHandler,
} from './performMove';

export enum MoveType {
  Single = 'single',
  Forward = 'forward',
  Double = 'double',
  PawnAttack = 'pawn-attack',
  LJump = 'l-jump',
  Castle = 'castle',
  All = 'all',
}

export enum CaptureType {
  None,
  CanCapture,
  CaptureOnly,
}

type DirectionLimit = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type MoveMeta<TDirection extends DirectionOrDirectionArray = DirectionOrDirectionArray> = {
  readonly capture: CaptureType,
  readonly directionLimit: TDirection extends Direction ? DirectionLimit : readonly [DirectionLimit, DirectionLimit],
  readonly onlyFromStartingPos?: true,
  readonly ignoresBlockingPieces?: true,
  readonly onlyFinalPositionIsValid?: true,
}

export type DirectionOrDirectionArray = Direction | readonly [Direction, Direction];
// TODO: does readonly break Array.isArray type guards?
function isDirectionTuple(direction: DirectionOrDirectionArray): direction is readonly [Direction, Direction] {
  return Array.isArray(direction);
}

export type MoveData<TDirection extends DirectionOrDirectionArray = DirectionOrDirectionArray> = {
  readonly moveType: MoveType,
  readonly sourcePos: BoardPosition,
  readonly direction: TDirection,
  readonly moveMeta: MoveMeta<TDirection>,
}

function extractDirectionAndLimitTuples(moveData: MoveData): Iterable<readonly [Direction, DirectionLimit]> {
  return zipExact(ensureArray<Direction>(moveData.direction), ensureArray(moveData.moveMeta.directionLimit));
}

// Helper function to determine if a move is blocked
function isMoveBlocked(result: BoardScannerResult, sourcePiece: ChessPieceColored, isAttack: boolean, ignoresBlockingPieces: boolean): boolean {
  if (!isAttack && !ignoresBlockingPieces && result.piece !== NoPiece) {
    return true;
  }
  if (!ignoresBlockingPieces && isColoredPieceContainer(result.piece) && result.piece.coloredPiece.color === sourcePiece.coloredPiece.color) {
    return true;
  }
  return false;
}

// Helper function to handle the last move's conditions
function hasValidLastMove(moves: BoardScannerResult[], sourcePiece: ChessPieceColored, isAttack: boolean): boolean {
  if (isNotEmpty(moves)) {
    const lastMove = last(moves);
    const targetPiece = lastMove.piece;
    if (isColoredPieceContainer(targetPiece)) {
      // if attacking and target piece is different color
      if (isAttack && targetPiece.coloredPiece.color !== sourcePiece.coloredPiece.color) {
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

export type ExecutableMove = {
  fromPos: BoardPosition,
  toPos: BoardPosition,
  expectedCapturePos: BoardPosition | undefined,
  // TODO: not sure how i feel about passing in moveHandler
  //  but until we can find a better way to remove the circular reference its required
  exec(gameState: GameState, moveHandler: MoveHandler, updateGameStatus?: boolean): ChessPiece,
  tryExec(...args: Parameters<ExecutableMove['exec']>): Result<ReturnType<ExecutableMove['exec']>, unknown>,
}

export function executableMove(
  fromPos: BoardPosition,
  toPos: BoardPosition,
  expectedCapturePos?: BoardPosition,
  alternateMoveHandler?: AlternateMoveHandler,
): ExecutableMove {
  return {
    fromPos,
    toPos,
    expectedCapturePos,
    exec(gameState: GameState, moveHandler: MoveHandler, updateGameStatus = true) {
      return moveHandler(gameState, this.fromPos, this.toPos, this.expectedCapturePos, alternateMoveHandler, updateGameStatus);
    },
    tryExec(...args: Parameters<typeof this.exec>) {
      try {
        return Result.Ok(this.exec(...args));
      }
      catch (err) {
        return Result.Err(err);
      }
    },
  };
}

function isValidCapture(movingPiece: ChessPieceColored, scannerResult: BoardScannerResult, captureType: CaptureType): boolean {
  if (captureType === CaptureType.CaptureOnly) {
    if (ChessPiece.ColoredPiece.is(scannerResult.piece) && scannerResult.piece.coloredPiece.color !== movingPiece.coloredPiece.color) {
      // can capture
      return true;
    }
    // cant capture same color or move to empty square
    return false;
  }
  if (captureType === CaptureType.CanCapture) {
    if (ChessPiece.ColoredPiece.is(scannerResult.piece)) {
      if (scannerResult.piece.coloredPiece.color !== movingPiece.coloredPiece.color) {
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
    if (ChessPiece.ColoredPiece.is(scannerResult.piece)) {
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
  const sourcePiece = getChessPieceColoredOrThrow(gameState.board, moveData.sourcePos);
  let moves: BoardScannerResult[] = [];
  let lastPos = moveData.sourcePos;

  // for pawn double moves and castling
  if (!!moveData.moveMeta.onlyFromStartingPos && !isPieceAtStartingPos(gameState.board, moveData.sourcePos)) {
    return [];
  }

  // EnPassant handling
  if (moveData.moveType === MoveType.PawnAttack) {
    const enPassantCaptureData = getEnPassantCaptureData(gameState);
    if (enPassantCaptureData) {
      if (enPassantCaptureData.attackFromPos.find(pos => pos.toString() === moveData.sourcePos.toString())) {
        return [executableMove(moveData.sourcePos, enPassantCaptureData.finalPos, enPassantCaptureData.capturePos)];
      }
    }
  }

  // TODO: this feels weird
  if (moveData.moveType === MoveType.Castle) {
    // TODO: find better way to handle this
    const direction = moveData.direction;
    if (isDirectionTuple(direction)) {
      throw new Error('bad move data');
    }
    const castleSides = getValidCastleSides(gameState.board, gameState.castlingRights, moveData.sourcePos);
    const side = castleSides.find(side => getCastleSideFromDirection(direction) === side);
    if (!side) return [];
    const targetPos = mapCastleSideToTargetPosition(side, moveData.sourcePos);
    return [executableMove(moveData.sourcePos, targetPos, undefined, (gameState, fromPos, toPos) => performCastle(gameState.board, fromPos, toPos))];
  }

  outer: for (const [direction, limit] of directionsWithLimits) {
    let remaining = limit;
    const scanner = boardScanner(gameState.board, lastPos, direction, shouldStopOnPiece);
    for (const result of scanner) {
      if (isMoveBlocked(result, sourcePiece, !!moveData.moveMeta.capture, !!moveData.moveMeta.ignoresBlockingPieces)) {
        break outer;
      }
      lastPos = result.pos;
      moves.push(result);
      if (--remaining === 0) {
        break;
      }
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
      expectedCapturePos = lastMove.piece !== NoPiece ? lastMove.pos : undefined;
      return [executableMove(moveData.sourcePos, lastMove.pos, expectedCapturePos)];
    }
    return [];
  }

  return moves.map(move => {
    const expectedCapturePos = move.piece !== NoPiece ? move.pos : undefined;
    return executableMove(moveData.sourcePos, move.pos, expectedCapturePos);
  });
}

export abstract class Move<TDirection extends DirectionOrDirectionArray = Direction> {
  protected constructor(
    public readonly moveType: MoveType,
    public readonly direction: TDirection,
    public readonly moveMeta: MoveMeta<TDirection>,
  ) {
  }

  public test(gameState: GameState, sourcePos: BoardPosition): ExecutableMove[] {
    return getValidMoves(gameState, {
      moveType: this.moveType,
      sourcePos,
      direction: this.direction,
      moveMeta: this.moveMeta,
    });
  }

  public process(gameState: GameState, moveHandler: MoveHandler, sourcePos: BoardPosition, moveIndex: number): ChessPiece {
    const validMoves = this.test(gameState, sourcePos);
    if (!isNotEmpty(validMoves)) {
      // TODO: add InvalidMoveError
      throw new Error('Invalid move');
    }
    const chosenMove = validMoves[moveIndex];
    if (!chosenMove) {
      throw new Error('Invalid move specified');
    }
    return chosenMove.exec(gameState, moveHandler);
  }
}

