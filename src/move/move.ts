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

export function move(gameState: GameState, fromPos: BoardPosition, toPos: BoardPosition, promoteToPiece?: PieceType): MoveResult {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, fromPos);
  const moves = resolveMoves(movingPiece.coloredPiece.pieceType, movingPiece.coloredPiece.color);
  const matchedMoves = matchMoves(gameState, fromPos, toPos, moves);
  assertHasMatchedMove(fromPos, toPos, matchedMoves);
  assertNonAmbiguousMove(fromPos, toPos, matchedMoves);
  const matchingMove: MoveResult = {
    ...last(matchedMoves),
    capturedPiece: NoPiece,
  };
  const processMove = () => {
    // TODO: is it worth keeping process vs just calling chosenMove.exec(gameState, performMove) directly?
    matchingMove.capturedPiece = matchingMove.move.process(gameState, performMove, fromPos, matchingMove.moveIndex);
  };
  if (isPromotionAvailable(gameState, fromPos, toPos)) {
    if (!promoteToPiece) {
      throw new PromotionRequiredError('must specify promotion before making move!');
    }
    processMove();
    gameState.board.placePieceFromPos(chessPieceFromColorAndType(movingPiece.coloredPiece.color, promoteToPiece), toPos);
  }
  else {
    processMove();
  }
  return matchingMove;
}
