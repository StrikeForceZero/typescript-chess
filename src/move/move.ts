import { BoardPosition } from '../board/BoardPosition';
import { getChessPieceColoredOrThrow } from '../board/utils/BoardUtils';
import {
  ChessPiece,
  NoPiece,
} from '../piece/ChessPiece';
import { GameState } from '../state/GameState';
import { updateCastleRights } from '../state/utils/CastlingRightsUtils';

export function move(gameState: GameState, from: BoardPosition, to: BoardPosition, alternateCapturePos?: BoardPosition): ChessPiece {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, from);
  let capturePiece = gameState.board.removePieceFromPos(to);
  gameState.board.placePieceFromPos(movingPiece, to);
  if (alternateCapturePos) {
    if (capturePiece !== NoPiece) {
      throw new Error('multiple captures!');
    }
    capturePiece = gameState.board.removePieceFromPos(alternateCapturePos);
  }
  updateCastleRights(gameState.board, gameState.castlingRights);
  return capturePiece;
}
