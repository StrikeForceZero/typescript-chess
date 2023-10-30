import { GameState } from '../state/GameState';
import { determineGameStatus } from '../state/utils/GameStatusUtils';
import { deserialize } from './deserializer';
import { FENString } from './FENString';

export function deserializerWithStatus(fen: FENString, evalGameState = false): GameState {
  const gameState = deserialize(fen);
  if (evalGameState) {
    gameState.gameStatus = determineGameStatus(gameState);
  }
  return gameState;
}
