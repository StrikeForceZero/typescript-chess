import { BoardPosition } from '../board/BoardPosition';
import { getChessPieceColoredOrThrow } from '../board/utils/BoardUtils';
import {
  ChessPiece,
  NoPiece,
} from '../piece/ChessPiece';
import {
  InverseColorMap,
  PieceColor,
} from '../piece/PieceColor';
import { PieceType } from '../piece/PieceType';
import { GameState } from '../state/GameState';
import { updateCastleRights } from '../state/utils/CastlingRightsUtils';
import { getEnPassantSquareFromMove } from '../state/utils/EnPassantUtils';
import { determineGameStatus } from '../state/utils/GameStatusUtils';

export type AlternateMoveHandler = (gameState: GameState, fromPos: BoardPosition, toPos: BoardPosition, alternativeCapture?: BoardPosition) => ChessPiece | void;

export function defaultMoveHandler(
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  expectedCapturePos?: BoardPosition,
): ChessPiece {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, from);
  const unExpectedCapturePiece = gameState.board.removePieceFromPos(to);
  if (unExpectedCapturePiece !== NoPiece) {
    throw new Error('unexpected capture!');
  }
  let capturePiece: ChessPiece = NoPiece;
  if (expectedCapturePos) {
    capturePiece = gameState.board.removePieceFromPos(expectedCapturePos);
  }
  gameState.board.removePieceFromPos(from);
  gameState.board.placePieceFromPos(movingPiece, to);
  return capturePiece;
}

export function move(
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  expectedCapturePos?: BoardPosition,
  alternateMoveHandler?: AlternateMoveHandler
): ChessPiece {
  let capturePiece: ChessPiece = NoPiece;
  const movingPiece = gameState.board.getPieceFromPos(from);
  // TODO: this feels weird
  if (!alternateMoveHandler) {
    capturePiece = defaultMoveHandler(gameState, from, to, expectedCapturePos);
  } else {
    capturePiece = alternateMoveHandler(gameState, from, to, expectedCapturePos) ?? NoPiece;
  }
  gameState.enPassantTargetSquare = getEnPassantSquareFromMove(gameState.board, from, to);
  updateCastleRights(gameState.board, gameState.castlingRights);

  if (capturePiece !== NoPiece || ChessPiece.ColoredPiece.is(movingPiece) && movingPiece.coloredPiece.pieceType === PieceType.Pawn) {
    gameState.moveCounters.halfMoveClock += 1;
  }
  if (gameState.activeColor === PieceColor.Black) {
    gameState.moveCounters.fullMoveNumber += 1;
  }
  gameState.activeColor = InverseColorMap[gameState.activeColor];
  gameState.gameStatus = determineGameStatus(gameState);
  return capturePiece;
}
