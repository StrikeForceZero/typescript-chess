import { isBoardAtStartingPos } from '../../board/utils/BoardUtils';
import { assertExhaustive } from '../../utils/assert';
import { GameState } from '../GameState';
import { GameStatus } from '../GameStatus';
import {
  isCheck,
  isCheckMate,
  isStalemate,
} from './CheckUtils';

export function determineGameStatus(gameState: GameState, checkStartingPositions = false): GameStatus {
  if (isCheckMate(gameState)) {
    return GameStatus.Checkmate;
  }
  if (isCheck(gameState)) {
    return GameStatus.Check;
  }
  if (isStalemate(gameState)) {
    return GameStatus.Stalemate;
  }
  if (gameState.moveCounters.fullMoveNumber === 0 || checkStartingPositions && isBoardAtStartingPos(gameState.board)) {
    return GameStatus.New;
  }
  // TODO: GameStatus.Draw
  return GameStatus.InProgress;
}

export function isGameOver(gameState: GameState): boolean {
  switch (gameState.gameStatus) {
    case GameStatus.New: return false;
    case GameStatus.InProgress: return false;
    case GameStatus.Check: return false;
    case GameStatus.Checkmate: return true;
    case GameStatus.Stalemate: return true;
    case GameStatus.Draw: return true;
    default: return assertExhaustive(gameState.gameStatus);
  }
}
