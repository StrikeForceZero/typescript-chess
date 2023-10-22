import { BoardPosition } from '../board/BoardPosition';
import { getChessPieceColoredOrThrow } from '../board/utils/BoardUtils';
import { GameState } from '../state/GameState';
import {
  count,
  isNotEmpty,
  last,
  tallyBy,
} from '../utils/array';
import { entries } from '../utils/object';
import {
  DirectionOrDirectionArray,
  Move,
  MoveType,
} from './moves';
import { performMove } from './performMove';
import { PieceMoveMap } from './PieceMoveMap';
import { isSameMoveFactory } from './utils/MoveUtils';

export type MatchedMove = {
  move: Move<DirectionOrDirectionArray>,
  moveIndex: number,
}

export function move(gameState: GameState, fromPos: BoardPosition, toPos: BoardPosition): MatchedMove {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, fromPos);
  const moves = PieceMoveMap[movingPiece.coloredPiece.pieceType](movingPiece.coloredPiece.color).flat();
  const matchingMoves: MatchedMove[] = [];
  for (const move of moves) {
    const validMoves = move.test(gameState, fromPos);
    if (!isNotEmpty(validMoves)) {
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
  if (!isNotEmpty(matchingMoves)) {
    throw new Error(`Invalid move! ${fromPos} -> ${toPos}`);
  }
  if (matchingMoves.length > 1) {
    const matchingMoveByTypeMap = tallyBy(matchingMoves, value => value.move.moveType);
    // TODO: maybe remove redundant LJump moves from PieceMoveMap
    if (count(entries(matchingMoveByTypeMap), ([key, _value]) => key !== MoveType.LJump)) {
      // TODO: shouldn't occur, but until we can prove it in a test, leave it here
      const moveTypes = matchingMoves.map(({ move }) => move.moveType);
      throw new Error(`ambiguous move ${JSON.stringify(moveTypes)}: ${fromPos} -> ${toPos}`);
    }
  }
  const matchingMove = last(matchingMoves);
  // TODO: is it worth keeping process vs just calling chosenMove.exec(gameState, performMove) directly?
  matchingMove.move.process(gameState, performMove, fromPos, matchingMove.moveIndex);
  return matchingMove;
}
