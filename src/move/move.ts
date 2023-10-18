import { BoardPosition } from '../board/BoardPosition';
import { getChessPieceColoredOrThrow } from '../board/utils/BoardUtils';
import {
  ChessPiece,
  NoPiece,
} from '../piece/ChessPiece';
import { GameState } from '../state/GameState';
import { updateCastleRights } from '../state/utils/CastlingRightsUtils';

export type AlternateMoveHandler = (gameState: GameState, fromPos: BoardPosition, toPos: BoardPosition, alternativeCapture?: BoardPosition) => ChessPiece | void;

export function move(
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  alternateCapturePos?: BoardPosition,
  alternateMoveHandler?: AlternateMoveHandler
): ChessPiece {
  let capturePiece: ChessPiece = NoPiece;
  // TODO: this feels weird
  if (!alternateMoveHandler) {
    const movingPiece = getChessPieceColoredOrThrow(gameState.board, from);
    capturePiece = gameState.board.removePieceFromPos(to);
    gameState.board.placePieceFromPos(movingPiece, to);
    if (alternateCapturePos) {
      if (capturePiece !== NoPiece) {
        throw new Error('multiple captures!');
      }
      capturePiece = gameState.board.removePieceFromPos(alternateCapturePos);
    }
  } else {
    capturePiece = alternateMoveHandler(gameState, from, to, alternateCapturePos) ?? NoPiece;
  }
  updateCastleRights(gameState.board, gameState.castlingRights);
  return capturePiece;
}
