import { BoardPosition } from '../board/BoardPosition';
import { getColoredPieceContainerOrThrow } from '../board/utils/BoardUtils';
import { ChessPiece } from '../piece/ChessPiece';
import { GameState } from '../state/GameState';

export function move(gameState: GameState, from: BoardPosition, to: BoardPosition): ChessPiece {
  const movingPiece = getColoredPieceContainerOrThrow(gameState.board, from);
  const capturePiece = gameState.board.removePieceFromPos(to);
  gameState.board.placePieceFromPos(movingPiece, to);
  return capturePiece;
}
