import { BoardPosition } from '../board/BoardPosition';
import { getChessPieceColoredOrThrow } from '../board/utils/BoardUtils';
import {
  ChessPiece,
  NoPiece,
} from '../piece/ChessPiece';
import { GameState } from '../state/GameState';
import { updateCastleRights } from '../state/utils/CastlingRightsUtils';
import { getEnPassantSquareFromMove } from '../state/utils/EnPassantUtils';

export type AlternateMoveHandler = (gameState: GameState, fromPos: BoardPosition, toPos: BoardPosition, alternativeCapture?: BoardPosition) => ChessPiece | void;

export function defaultMoveHandler(
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  alternateCapturePos?: BoardPosition,
): ChessPiece {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, from);
  let capturePiece = gameState.board.removePieceFromPos(to);
  gameState.board.placePieceFromPos(movingPiece, to);
  if (alternateCapturePos) {
    if (capturePiece !== NoPiece) {
      throw new Error('multiple captures!');
    }
    capturePiece = gameState.board.removePieceFromPos(alternateCapturePos);
  }
  return capturePiece;
}

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
    capturePiece = defaultMoveHandler(gameState, from, to, alternateCapturePos);
  } else {
    capturePiece = alternateMoveHandler(gameState, from, to, alternateCapturePos) ?? NoPiece;
  }
  gameState.enPassantTargetSquare = getEnPassantSquareFromMove(gameState.board, from, to);
  updateCastleRights(gameState.board, gameState.castlingRights);
  return capturePiece;
}
