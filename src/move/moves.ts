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
import { zipExact } from '../utils/zip';
import {
  AnyDiagonalDirection,
  AnyDirection,
  AnySimpleDirection,
  Direction,
  ToDirection,
  toDirection,
  ToDirectionArray,
} from './direction';
import {
  AlternateMoveHandler,
  move,
} from './move';

export enum MoveType {
  Single = 'single',
  Forward = 'forward',
  Double = 'double',
  EnPassant = 'en-passant',
  LJump = 'l-jump',
  Castle = 'castle',
  All = 'all',
}

type CaptureMeta = {
  readonly captureIsNotDestination: true,
}
type DirectionLimit = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type MoveMeta<TDirection extends DirectionOrDirectionArray = DirectionOrDirectionArray> = {
  readonly capture?: true | CaptureMeta,
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

type ExecutableMove = {
  fromPos: BoardPosition,
  toPos: BoardPosition,
  expectedCapturePos: BoardPosition | undefined,
  exec(gameState: GameState): ChessPiece,
}

function executableMove(
  fromPos: BoardPosition,
  toPos: BoardPosition,
  expectedCapturePos?: BoardPosition,
  alternateMoveHandler?: AlternateMoveHandler
): ExecutableMove {
  return {
    fromPos,
    toPos,
    expectedCapturePos,
    exec(gameState: GameState) {
      return move(gameState, this.fromPos, this.toPos, this.expectedCapturePos, alternateMoveHandler);
    },
  };
}

export function getValidMoves(gameState: GameState, moveData: MoveData): ExecutableMove[] {
  const shouldStopOnPiece = !moveData.moveMeta.ignoresBlockingPieces;
  const directionsWithLimits = extractDirectionAndLimitTuples(moveData);
  const sourcePiece = getChessPieceColoredOrThrow(gameState.board, moveData.sourcePos);
  const moves: BoardScannerResult[] = [];
  let lastPos = moveData.sourcePos;

  // for pawn double moves and castling
  if (!!moveData.moveMeta.onlyFromStartingPos && !isPieceAtStartingPos(gameState.board, moveData.sourcePos)) {
    return [];
  }

  if (moveData.moveType === MoveType.EnPassant) {
    const enPassantCaptureData = getEnPassantCaptureData(gameState);
    if (!enPassantCaptureData) {
      return [];
    }
    if (!enPassantCaptureData.attackFromPos.find(pos => pos === moveData.sourcePos)) {
      return [];
    }
    return [executableMove(moveData.sourcePos, enPassantCaptureData.finalPos, enPassantCaptureData.capturePos)];
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

  if (!hasValidLastMove(moves, sourcePiece, !!moveData.moveMeta.capture)) {
    moves.pop();
  }

  if (isNotEmpty(moves) && moveData.moveMeta.onlyFinalPositionIsValid) {
    const lastMoveIx = sum(ensureArray(moveData.moveMeta.directionLimit)) - 1;
    const lastMove = moves[lastMoveIx];
    return lastMove ? [executableMove(moveData.sourcePos, lastMove.pos)] : [];
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
  public process(gameState: GameState, sourcePos: BoardPosition, moveIndex: number): ChessPiece {
    const validMoves = this.test(gameState, sourcePos);
    if (!isNotEmpty(validMoves)) {
      // TODO: add InvalidMoveError
      throw new Error('Invalid move');
    }
    const chosenMove = validMoves[moveIndex];
    if (!chosenMove) {
      throw new Error('Invalid move specified');
    }
    return chosenMove.exec(gameState);
  }
}

export class Single extends Move {
  constructor(
    direction: Direction,
  ) {
    super(
      MoveType.Single,
      direction,
      {
        capture: true,
        directionLimit: 1,
      },
    );
  }
}

export class Forward extends Move<ToDirection<AnySimpleDirection.North | AnySimpleDirection.South>> {
  constructor(
    direction: AnySimpleDirection.North | AnySimpleDirection.South,
  ) {
    super(
      MoveType.Forward,
      toDirection(direction),
      {
        directionLimit: 1,
      },
    );
  }
}

export class Double extends Move<ToDirection<AnySimpleDirection.North | AnySimpleDirection.South>> {
  constructor(
    direction: AnySimpleDirection.North | AnySimpleDirection.South,
  ) {
    super(
      MoveType.Double,
      toDirection(direction),
      {
        onlyFromStartingPos: true,
        onlyFinalPositionIsValid: true,
        directionLimit: 2,
      },
    );
  }
}

export class EnPassant extends Move<ToDirection<AnyDiagonalDirection>> {
  constructor(
    direction: AnyDiagonalDirection,
  ) {
    super(
      MoveType.EnPassant,
      toDirection(direction),
      {
        capture: { captureIsNotDestination: true },
        directionLimit: 1,
      },
    );
  }
}

export class LJump extends Move<ToDirectionArray<readonly [AnySimpleDirection, AnySimpleDirection]>> {
  constructor(
    direction: readonly [AnySimpleDirection, AnySimpleDirection],
  ) {
    super(
      MoveType.LJump,
      toDirection(direction),
      {
        capture: true,
        directionLimit: [1, 2],
        ignoresBlockingPieces: true,
        onlyFinalPositionIsValid: true,
      },
    );
  }
}

export class Castle extends Move<ToDirection<AnyDirection.East | AnyDirection.West>> {
  constructor(
    direction: AnyDirection.East | AnyDirection.West,
  ) {
    super(
      MoveType.Castle,
      toDirection(direction),
      {
        onlyFromStartingPos: true,
        directionLimit: 2,
      },
    );
  }
}

export class All extends Move {
  constructor(
    direction: Direction,
  ) {
    super(
      MoveType.All,
      direction,
      {
        capture: true,
        directionLimit: 7,
      },
    );
  }
}
