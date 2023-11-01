import cloneDeep from 'lodash.clonedeep';
import { BoardPosition } from '../board/BoardPosition';
import {
  ChessPiece,
  fixReference,
} from '../piece/ChessPiece';
import { GameState } from '../state/GameState';
import { Result } from '../utils/Result';
import {
  AlternateMoveHandler,
  MoveHandler,
} from './performMove';

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
      const [gameState, ...restArgs] = args;
      const clonedGameState = cloneDeep(gameState);
      for (const square of clonedGameState.board) {
        square.piece = fixReference(square.piece);
      }
      return Result.captureFlatten(() => this.exec(clonedGameState, ...restArgs));
    },
  };
}
