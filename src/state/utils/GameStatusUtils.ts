import { isBoardAtStartingPos } from '../../board/utils/BoardUtils';
import { deserialize } from '../../fen/deserializer';
import {
  FENString,
  getParts,
} from '../../fen/FENString';
import {
  isNotEmpty,
  last,
} from '../../utils/array';
import { assertExhaustive } from '../../utils/assert';
import { GameState } from '../GameState';
import { GameStatus } from '../GameStatus';
import {
  isCheck,
  isCheckMate,
  isStalemate,
} from './CheckUtils';

export function determineGameStatus(gameState: GameState, checkStartingPositions = false): GameStatus {
  if (isCheckMate(gameState, true)) {
    return GameStatus.Checkmate;
  }
  if (isCheck(gameState, true)) {
    return GameStatus.Check;
  }
  if (isStalemate(gameState, true)) {
    return GameStatus.Stalemate;
  }
  if (gameState.moveCounters.fullMoveNumber === 0 || checkStartingPositions && isBoardAtStartingPos(gameState.board)) {
    return GameStatus.New;
  }
  if (gameState.moveCounters.halfMoveClock === 50 || isThreefoldRepetition(gameState)) {
    return GameStatus.Draw;
  }
  return GameStatus.InProgress;
}

function stripCountersFromFENString(fenStr: FENString): string {
  const [
    boardString,
    activeColorString,
    castleRightsString,
    enPassantTargetSquareString,
  ] = getParts(fenStr);
  return [
    boardString,
    activeColorString,
    castleRightsString,
    enPassantTargetSquareString,
  ].join(' ');
}

export function stateOccurrenceCount(gameState: GameState, state: FENString): number {
  const lastEntryStripped = stripCountersFromFENString(state);
  const sameStates = gameState.history.history.filter(fen => stripCountersFromFENString(fen) === lastEntryStripped);
  return sameStates.length;
}

export function isThreefoldRepetition(gameState: GameState): boolean {
  const lastEntry = last(gameState.history.history);
  if (!lastEntry) return false;
  return stateOccurrenceCount(gameState, lastEntry) === 3;
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

export function revert(gameState: GameState, historyIndex: number): void {
  const gameStateHistory = gameState.history;
  if (!isNotEmpty(gameStateHistory.history)) {
    throw new Error('history is empty!');
  }
  const specifiedState = gameStateHistory.history[historyIndex];
  if (!specifiedState) {
    throw new Error(`historyIndex (${historyIndex}) out of bounds`);
  }
  const revertedGameState = deserialize(specifiedState);
  Object.assign(gameState, {
    ...revertedGameState,
    history: {
      ...revertedGameState.history,
      //
      history: gameStateHistory.history.slice(0, historyIndex),
    },
  });
  gameState.gameStatus = determineGameStatus(gameState);
}
