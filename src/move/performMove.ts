import { BoardPosition } from '../board/BoardPosition';
import { getChessPieceColoredOrThrow } from '../board/utils/BoardUtils';
import { serialize } from '../fen/serialize';
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
import { GameStatus } from '../state/GameStatus';
import { updateCastleRights } from '../state/utils/CastlingRightsUtils';
import { isCheck } from '../state/utils/CheckUtils';
import { getEnPassantSquareFromMove } from '../state/utils/EnPassantUtils';
import {
  determineGameStatus,
  isGameOver,
  revert,
} from '../state/utils/GameStatusUtils';

export type MoveHandler = (
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  expectedCapturePos?: BoardPosition,
  alternateMoveHandler?: AlternateMoveHandler,
  updateGameStatus?: boolean,
) => ChessPiece;
export type AlternateMoveHandler = (
  gameState: GameState,
  fromPos: BoardPosition,
  toPos: BoardPosition,
  alternativeCapture?: BoardPosition,
) => ChessPiece | void;

export function defaultMoveHandler(
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  expectedCapturePos?: BoardPosition,
): ChessPiece {
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, from);
  let capturePiece: ChessPiece = NoPiece;
  if (expectedCapturePos) {
    capturePiece = gameState.board.removePieceFromPos(expectedCapturePos);
  }
  const unExpectedCapturePiece = gameState.board.removePieceFromPos(to);
  if (unExpectedCapturePiece !== NoPiece) {
    throw new Error('unexpected capture!');
  }
  gameState.board.removePieceFromPos(from);
  gameState.board.placePieceFromPos(movingPiece, to);
  return capturePiece;
}

export function performMove(
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  expectedCapturePos?: BoardPosition,
  alternateMoveHandler?: AlternateMoveHandler,
  updateGameStatus = true,
): ChessPiece {
  if (isGameOver(gameState)) {
    throw new Error('invalid move, game is over!');
  }
  let capturePiece: ChessPiece = NoPiece;
  const movingPiece = getChessPieceColoredOrThrow(gameState.board, from);
  if (movingPiece.coloredPiece.color !== gameState.activeColor) {
    throw new Error(`Invalid move: ${gameState.activeColor} turn!`);
  }
  try {
    const startedInCheck = gameState.gameStatus === GameStatus.Check;
    // TODO: this feels weird
    if (!alternateMoveHandler) {
      capturePiece = defaultMoveHandler(gameState, from, to, expectedCapturePos);
    }
    else {
      capturePiece = alternateMoveHandler(gameState, from, to, expectedCapturePos) ?? NoPiece;
    }
    if (startedInCheck && isCheck(gameState)) {
      throw new Error('Invalid move: still in check!');
    }
    gameState.enPassantTargetSquare = getEnPassantSquareFromMove(gameState.board, from, to);
    updateCastleRights(gameState.board, gameState.castlingRights);

    if (capturePiece !== NoPiece || ChessPiece.ColoredPiece.is(movingPiece) && movingPiece.coloredPiece.pieceType !== PieceType.Pawn) {
      gameState.moveCounters.halfMoveClock += 1;
    }
    else {
      gameState.moveCounters.halfMoveClock = 0;
    }
    if (gameState.activeColor === PieceColor.Black) {
      gameState.moveCounters.fullMoveNumber += 1;
    }
    gameState.activeColor = InverseColorMap[gameState.activeColor];
    gameState.history.history.push(serialize(gameState));
  }
  catch (err) {
    revert(gameState);
  }
  if (updateGameStatus) {
    gameState.gameStatus = determineGameStatus(gameState);
  }
  return capturePiece;
}