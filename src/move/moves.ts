import { BoardPosition } from '../board/BoardPosition';
import {
  boardScanner,
  BoardScannerResult,
} from '../board/utils/BoardScanner';
import { getChessPieceColoredOrThrow } from '../board/utils/BoardUtils';
import {
  ChessPiece,
  ChessPieceColored,
  isColoredPieceContainer,
  NoPiece,
} from '../piece/ChessPiece';
import { GameState } from '../state/GameState';
import {
  ensureArray,
  isNotEmpty,
  last,
  lastOrThrow,
  sum,
} from '../utils/array';
import { impossible } from '../utils/assert';
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
import { move } from './move';

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

export type MoveData<TDirection extends DirectionOrDirectionArray = DirectionOrDirectionArray> = {
  readonly moveType: MoveType,
  readonly sourcePos: BoardPosition,
  readonly direction: TDirection,
  readonly moveMeta: MoveMeta<TDirection>,
}

function extractDirectionAndLimitTuples(moveData: MoveData): Iterable<readonly [Direction, DirectionLimit]> {
  return zipExact(ensureArray<Direction>(moveData.direction), ensureArray(moveData.moveMeta.directionLimit));
}

// TODO: remove
export function getValidMovesOld(gameState: GameState, moveData: MoveData, isAttack: boolean = false): BoardScannerResult[] {
  const shouldStopOnPiece = moveData.moveMeta.ignoresBlockingPieces !== true;
  const directionsWithLimits = extractDirectionAndLimitTuples(moveData);
  const sourcePiece = getChessPieceColoredOrThrow(gameState.board, moveData.sourcePos);
  const moves: BoardScannerResult[] = [];
  let lastPos = moveData.sourcePos;

  outer: for (const [direction, limit] of directionsWithLimits) {
    let remaining = limit;
    const scanner = boardScanner(gameState.board, lastPos, direction, shouldStopOnPiece);
    for (const result of scanner) {
      if (!isAttack && !moveData.moveMeta.ignoresBlockingPieces) {
        if (result.piece !== NoPiece) {
          // blocked: can't jump over and can't attack
          break outer;
        }
      } else if (!moveData.moveMeta.ignoresBlockingPieces) {
        const targetPiece = result.piece;
        if (isColoredPieceContainer(targetPiece)) {
          if (targetPiece.coloredPiece.color === sourcePiece.coloredPiece.color) {
            // blocked: can't jump over and can't attack
            break outer;
          }
        }
      }
      lastPos = result.pos;
      moves.push(result);
      if (--remaining === 0) {
        break;
      }
    }
  }

  // this might not even be the final position of a requested move if we went out of bounds
  // but this will remove incorrect pieces for knights jumping because they are the only one with multi directionLimits
  if (moves.length > 0) {
    const lastMove = moves[moves.length - 1] as BoardScannerResult;
    const targetPiece = lastMove.piece;
    if (isColoredPieceContainer(targetPiece)) {
      if (isAttack) {
        // can't attack same color
        if (targetPiece.coloredPiece.color === sourcePiece.coloredPiece.color) {
          moves.pop();
        }
      } else {
        // blocked
        moves.pop();
      }
    }
  }

  if (moveData.moveMeta.onlyFinalPositionIsValid) {
    const lastMoveIx = lastOrThrow(ensureArray(moveData.moveMeta.directionLimit));
    // assuming non-empty due to types
    if (lastMoveIx === undefined) {
      impossible();
    }
    const lastMove = moves[lastMoveIx];

    if (!lastMove) {
      return [];
    }

    // if there is a piece at the target position
    if (isColoredPieceContainer(lastMove.piece)) {
      // if attacking and target piece is different color
      if (isAttack && lastMove.piece.coloredPiece.color !== sourcePiece.coloredPiece.color) {
        return [lastMove];
      }
      // cant attack same color / cant move to an occupied square
      return [];
    }

    // square unoccupied
    return [lastMove];
  }
  return moves;
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
  }
  // moves was empty
  return false;
}

export function getValidMoves(gameState: GameState, moveData: MoveData): BoardScannerResult[] {
  const shouldStopOnPiece = !moveData.moveMeta.ignoresBlockingPieces;
  const directionsWithLimits = extractDirectionAndLimitTuples(moveData);
  const sourcePiece = getChessPieceColoredOrThrow(gameState.board, moveData.sourcePos);
  const moves: BoardScannerResult[] = [];
  let lastPos = moveData.sourcePos;

  // TODO: handle enPassant and castling

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
    return lastMove ? [lastMove] : [];
  }

  return moves;
}


export abstract class Move<TDirection extends DirectionOrDirectionArray = Direction> {
  protected constructor(
    public readonly moveType: MoveType,
    public readonly direction: TDirection,
    public readonly moveMeta: MoveMeta<TDirection>,
  ) {
  }
  public test(gameState: GameState, sourcePos: BoardPosition): BoardScannerResult[] {
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
    const targetPos = chosenMove.pos;
    return move(gameState, sourcePos, targetPos);
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
  public override process(gameState: GameState, sourcePos: BoardPosition, moveIndex: number): ChessPiece {
    if (true as boolean) {
      // TODO: implement
      throw new Error('not implemented!');
    }
    return super.process(gameState, sourcePos, moveIndex);
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
        directionLimit: 2,
      },
    );
  }
  public override process(gameState: GameState, sourcePos: BoardPosition, moveIndex: number): ChessPiece {
    if (true as boolean) {
      // TODO: implement
      throw new Error('not implemented!');
    }
    return super.process(gameState, sourcePos, moveIndex);
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
