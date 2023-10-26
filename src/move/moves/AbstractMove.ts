import { BoardPosition } from '../../board/BoardPosition';
import { ChessPiece } from '../../piece/ChessPiece';
import { GameState } from '../../state/GameState';
import { isNotEmpty } from '../../utils/array';
import { InvalidMoveError } from '../../utils/errors/InvalidMoveError';
import { Direction } from '../direction';
import { ExecutableMove } from '../ExecutableMove';
import {
  DirectionOrDirectionArray,
  MoveMeta,
} from '../MoveData';
import { MoveType } from '../MoveType';
import { MoveHandler } from '../performMove';
import { getValidMoves } from '../utils/MoveUtils';

export abstract class AbstractMove<TDirection extends DirectionOrDirectionArray = Direction> {
  protected constructor(
    public readonly moveType: MoveType,
    public readonly direction: TDirection,
    public readonly moveMeta: MoveMeta<TDirection>,
  ) {
  }

  public getValidMovesForPosition(gameState: GameState, sourcePos: BoardPosition): ExecutableMove[] {
    return getValidMoves(gameState, {
      moveType: this.moveType,
      sourcePos,
      direction: this.direction,
      moveMeta: this.moveMeta,
    });
  }

  public process(gameState: GameState, moveHandler: MoveHandler, sourcePos: BoardPosition, moveIndex: number): ChessPiece {
    const validMoves = this.getValidMovesForPosition(gameState, sourcePos);
    if (!isNotEmpty(validMoves)) {
      throw new InvalidMoveError('Invalid move');
    }
    const chosenMove = validMoves[moveIndex];
    if (!chosenMove) {
      throw new InvalidMoveError('Invalid move specified');
    }
    return chosenMove.exec(gameState, moveHandler);
  }
}

