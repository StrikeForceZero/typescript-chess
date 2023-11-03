import { BoardPosition } from '../board/BoardPosition';
import { serialize } from '../fen/serialize';
import { ChessPiece } from '../piece/ChessPiece';
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
} from '../state/utils/GameStatusUtils';
import { InvalidMoveError } from '../utils/errors/InvalidMoveError';
import { Option } from '../utils/Option';

export type MoveHandler = (
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  expectedCapturePos?: BoardPosition,
  alternateMoveHandler?: AlternateMoveHandler,
  updateGameStatus?: boolean,
) => Option<ChessPiece>;
export type AlternateMoveHandler = (
  gameState: GameState,
  fromPos: BoardPosition,
  toPos: BoardPosition,
  alternativeCapture?: BoardPosition,
) => Option<ChessPiece> | void;

export function defaultMoveHandler(
  gameState: GameState,
  from: BoardPosition,
  to: BoardPosition,
  expectedCapturePos?: BoardPosition,
): Option<ChessPiece> {
  const movingPiece = gameState.board.getPieceFromPosOrThrow(from);
  let capturePiece: Option<ChessPiece> = Option.None();
  if (expectedCapturePos) {
    capturePiece = gameState.board.removePieceFromPos(expectedCapturePos);
  }
  const unExpectedCapturePiece = gameState.board.removePieceFromPos(to);
  if (unExpectedCapturePiece.isSome()) {
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
): Option<ChessPiece> {
  if (isGameOver(gameState)) {
    throw new InvalidMoveError(`invalid move, game is over! (${gameState.gameStatus})`);
  }
  let capturePiece: Option<ChessPiece> = Option.None();
  const movingPiece = gameState.board.getPieceFromPosOrThrow(from);
  if (movingPiece.color !== gameState.activeColor) {
    throw new InvalidMoveError(`Invalid move: ${gameState.activeColor} turn!`);
  }
  // store the en passant target square temporarily and make sure the move is successful before updating the state
  const enPassantTargetSquare = getEnPassantSquareFromMove(gameState.board, from, to);
  const startedInCheck = gameState.gameStatus === GameStatus.Check;
  // TODO: this feels weird
  if (!alternateMoveHandler) {
    capturePiece = defaultMoveHandler(gameState, from, to, expectedCapturePos);
  }
  else {
    capturePiece = alternateMoveHandler(gameState, from, to, expectedCapturePos) ?? Option.None();
  }
  if (capturePiece.isSome()) {
    gameState.capturedPieces.push(capturePiece.value);
  }

  // clone, so we can update the state atomically
  {
    const gameStateCopy = gameState.clone();
    gameStateCopy.enPassantTargetSquare = enPassantTargetSquare;
    updateCastleRights(gameStateCopy.board, gameStateCopy.castlingRights);

    if (startedInCheck && isCheck(gameStateCopy, true)) {
      throw new InvalidMoveError('Invalid move: still in check!');
    }
    if (!startedInCheck && isCheck(gameStateCopy, true)) {
      throw new InvalidMoveError('Invalid move: can\'t move into check!');
    }
  }
  gameState.enPassantTargetSquare = enPassantTargetSquare;
  updateCastleRights(gameState.board, gameState.castlingRights);

  if (capturePiece.isSome() || movingPiece.pieceType !== PieceType.Pawn) {
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
  if (updateGameStatus) {
    gameState.gameStatus = determineGameStatus(gameState);
  }
  return capturePiece;
}
