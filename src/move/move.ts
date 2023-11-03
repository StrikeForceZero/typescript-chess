import { BoardPosition } from '../board/BoardPosition';
import { BoardRank } from '../board/BoardRank';
import { getChessPieceColoredOrThrow } from '../board/utils/BoardUtils';
import {
  ChessPiece,
  from as chessPieceFromColorAndType,
  NoPiece,
} from '../piece/ChessPiece';
import { PieceColor } from '../piece/PieceColor';
import { PieceType } from '../piece/PieceType';
import { GameState } from '../state/GameState';
import {
  count,
  isEmpty,
  isNotEmpty,
  last,
  NotEmptyArray,
  tallyBy,
} from '../utils/array';
import { assertExhaustive } from '../utils/assert';
import { InvalidMoveError } from '../utils/errors/InvalidMoveError';
import { PromotionRequiredError } from '../utils/errors/PromotionRequiredError';
import { entries } from '../utils/object';
import { Result } from '../utils/Result';
import { DirectionOrDirectionArray } from './MoveData';
import {
  AbstractMove,

} from './moves/AbstractMove';
import { MoveType } from './MoveType';
import { performMove } from './performMove';
import { resolveMoves } from './PieceMoveMap';
import { isSameMoveFactory } from './utils/MoveUtils';

type MatchedMove = {
  move: AbstractMove<DirectionOrDirectionArray>,
  moveIndex: number,
}

export type MoveResult = MatchedMove & {
  fromPos: BoardPosition,
  toPos: BoardPosition,
  capturedPiece: ChessPiece,
}

function matchMoves(gameState: GameState, fromPos: BoardPosition, toPos: BoardPosition, moves: AbstractMove<DirectionOrDirectionArray>[]): MatchedMove[] {
  const matchingMoves: MatchedMove[] = [];
  for (const move of moves) {
    const validMoves = move.getValidMovesForPosition(gameState, fromPos);
    if (isEmpty(validMoves)) {
      continue;
    }
    const isSameMove = isSameMoveFactory(fromPos, toPos);
    const moveIndex = validMoves.findIndex(isSameMove);
    if (moveIndex === -1) {
      continue;
    }
    if (moveIndex !== validMoves.findLastIndex(isSameMove)) {
      // TODO: shouldn't occur, but until we can prove it in a test, leave it here
      throw new Error(`ambiguous move ${move.moveType}: ${fromPos} -> ${toPos}`);
    }
    matchingMoves.push({
      move,
      moveIndex,
    });
  }
  return matchingMoves;
}

function extractMoveType(matchedMove: MatchedMove) {
  return matchedMove.move.moveType;
}

function countNonLJumpMoves(matchedMoves: MatchedMove[]): number {
  const matchingMoveByTypeMap = tallyBy(matchedMoves, extractMoveType);
  return count(entries(matchingMoveByTypeMap), ([key, _value]) => key !== MoveType.LJump);
}

function isPromotionAvailable(gameState: GameState, fromPos: BoardPosition, toPos: BoardPosition): boolean {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, fromPos);
  const { pieceType, color } = movingPiece.coloredPiece;
  if (pieceType !== PieceType.Pawn) return false;
  switch (color) {
    case PieceColor.White: return toPos.rank === BoardRank.EIGHT;
    case PieceColor.Black: return toPos.rank === BoardRank.ONE;
    default: return assertExhaustive(color);
  }
}

function assertHasMatchedMove(fromPos: BoardPosition, toPos: BoardPosition, matchedMoves: MatchedMove[]): asserts matchedMoves is NotEmptyArray<MatchedMove> {
  if (!isNotEmpty(matchedMoves)) {
    throw new InvalidMoveError(`Invalid move! ${fromPos} -> ${toPos}`);
  }
}

// TODO: maybe add fromPos to matched move and extract pos from the move instead of passing as a param
function assertNonAmbiguousMove(fromPos: BoardPosition, toPos: BoardPosition, matchedMoves: MatchedMove[]): asserts matchedMoves is MatchedMove[] | [MatchedMove] {
  if (matchedMoves.length > 1) {
    // TODO: maybe remove redundant LJump moves from PieceMoveMap
    if (countNonLJumpMoves(matchedMoves) > 0) {
      // TODO: shouldn't occur, but until we can prove it in a test, leave it here
      const moveTypes = matchedMoves.map(extractMoveType);
      throw new Error(`ambiguous move ${JSON.stringify(moveTypes)}: ${fromPos} -> ${toPos}`);
    }
  }
}

function assertValidMoveConditions(fromPos: BoardPosition, toPos: BoardPosition, matchedMoves: MatchedMove[]): asserts matchedMoves is [MatchedMove] {
  assertHasMatchedMove(fromPos, toPos, matchedMoves);
  assertNonAmbiguousMove(fromPos, toPos, matchedMoves);
}

function createMoveResult(fromPos: BoardPosition, toPos: BoardPosition, matchedMoves: NotEmptyArray<MatchedMove>): MoveResult {
  return {
    ...last(matchedMoves),
    fromPos,
    toPos,
    capturedPiece: NoPiece,
  };
}

function processMove(gameState: GameState, matchingMove: MoveResult, fromPos: BoardPosition, toPos: BoardPosition, promoteToPiece?: PieceType) {
  if (isPromotionAvailable(gameState, fromPos, toPos)) {
    if (!promoteToPiece) {
      throw new PromotionRequiredError('Must specify promotion before making move!');
    }
    executeMove(gameState, matchingMove, fromPos);
    promotePawn(gameState, toPos, promoteToPiece);
  } else {
    executeMove(gameState, matchingMove, fromPos);
  }
}

function executeMove(gameState: GameState, matchingMove: MoveResult, fromPos: BoardPosition) {
  matchingMove.capturedPiece = matchingMove.move.process(gameState, performMove, fromPos, matchingMove.moveIndex);
}

function promotePawn(gameState: GameState, targetPos: BoardPosition, promoteToPiece: PieceType) {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, targetPos);
  const promotionPiece = chessPieceFromColorAndType(movingPiece.coloredPiece.color, promoteToPiece);
  gameState.board.placePieceFromPos(promotionPiece, targetPos);
}

// TODO: ExecutableMove.tryExec is doing the same thing
function testMove(gameState: GameState, matchingMove: MoveResult, fromPos: BoardPosition, toPos: BoardPosition, promoteToPiece?: PieceType): Result<void, unknown> {
  return Result.captureFlatten(() => processMove(gameState.clone(), matchingMove, fromPos, toPos, promoteToPiece));
}

export function move(gameState: GameState, fromPos: BoardPosition, toPos: BoardPosition, promoteToPiece?: PieceType): MoveResult {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, fromPos);
  const validMoves = resolveMoves(movingPiece.coloredPiece.pieceType, movingPiece.coloredPiece.color);
  const matchedMoves = matchMoves(gameState, fromPos, toPos, validMoves);

  assertValidMoveConditions(fromPos, toPos, matchedMoves);

  const matchingMove: MoveResult = createMoveResult(fromPos, toPos, matchedMoves);
  // TODO: clean this up / make better
  const testMoveResult = testMove(gameState, matchingMove, fromPos, toPos, promoteToPiece);
  if (testMoveResult.isErr()) {
    throw testMoveResult.unwrapErr();
  }
  processMove(gameState, matchingMove, fromPos, toPos, promoteToPiece);

  return matchingMove;
}
