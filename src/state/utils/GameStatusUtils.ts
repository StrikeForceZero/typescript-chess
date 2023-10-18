import { isBoardAtStartingPos } from '../../board/utils/BoardUtils';
import { GameState } from '../GameState';
import { GameStatus } from '../GameStatus';
import {
  isCheck,
  isCheckMate,
} from './CheckUtils';

export function determineGameStatus(gameState: GameState, checkStartingPositions = false): GameStatus {
  if (isCheckMate(gameState)) {
    return GameStatus.Checkmate;
  }
  if (isCheck(gameState)) {
    return GameStatus.Check;
  }
  if (gameState.moveCounters.fullMoveNumber === 0 || checkStartingPositions && isBoardAtStartingPos(gameState.board)) {
    return GameStatus.New;
  }
  // TODO: GameStatus.StaleMate / GameStatus.Draw
  return GameStatus.InProgress;
}
