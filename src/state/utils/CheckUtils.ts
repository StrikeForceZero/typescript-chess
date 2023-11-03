import { performMove as standardMoveHandler } from '../../move/performMove';
import { PieceMoveMap } from '../../move/PieceMoveMap';
import { ChessPiece } from '../../piece/ChessPiece';
import { PieceType } from '../../piece/PieceType';
import { GameState } from '../GameState';
import { GameStatus } from '../GameStatus';

export function isCheck(gameState: GameState, forceRefresh = false, activeColor = gameState.activeColor): boolean {
  if (!forceRefresh) {
    return gameState.gameStatus === GameStatus.Check || gameState.gameStatus === GameStatus.Checkmate;
  }
  for (const square of gameState.board) {
    if (!ChessPiece.ColoredPiece.is(square.piece)) continue;
    // skip current player pieces
    if (square.piece.coloredPiece.color === activeColor) continue;
    const moves = PieceMoveMap[square.piece.coloredPiece.pieceType](square.piece.coloredPiece.color);
    for (const move of moves) {
      const validMoves = move.getValidMovesForPosition(gameState, square.pos);
      for (const validMove of validMoves) {
        if (!validMove.expectedCapturePos) continue;
        const targetPiece = gameState.board.getPieceFromPos(validMove.expectedCapturePos);
        if (!ChessPiece.ColoredPiece.is(targetPiece)) continue;
        if (targetPiece.coloredPiece.pieceType === PieceType.King) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isCheckMate(gameState: GameState, forceRefresh = false): boolean {
  if (!isCheck(gameState, forceRefresh)) return false;
  if (!forceRefresh) {
    return gameState.gameStatus === GameStatus.Check || gameState.gameStatus === GameStatus.Checkmate;
  }
  for (const square of gameState.board) {
    if (!ChessPiece.ColoredPiece.is(square.piece)) continue;
    // only check player in check
    if (square.piece.coloredPiece.color !== gameState.activeColor) continue;
    const moves = PieceMoveMap[square.piece.coloredPiece.pieceType](square.piece.coloredPiece.color);
    for (const move of moves) {
      const validMoves = move.getValidMovesForPosition(gameState, square.pos);
      for (const validMove of validMoves) {
        const result = validMove.tryExec(gameState.clone(), standardMoveHandler, false);
        if (result.isErr()) continue;
        return false;
      }
    }
  }
  return true;
}

export function isStalemate(gameState: GameState, forceRefresh = false): boolean {
  if (isCheck(gameState, forceRefresh)) return false;
  if (!forceRefresh) {
    return gameState.gameStatus === GameStatus.Stalemate;
  }
  for (const square of gameState.board) {
    if (!ChessPiece.ColoredPiece.is(square.piece)) continue;
    // only check active player
    if (square.piece.coloredPiece.color !== gameState.activeColor) continue;
    const moves = PieceMoveMap[square.piece.coloredPiece.pieceType](square.piece.coloredPiece.color);
    for (const move of moves) {
      const validMoves = move.getValidMovesForPosition(gameState, square.pos);
      for (const validMove of validMoves) {
        const result = validMove.tryExec(gameState.clone(), standardMoveHandler, false);
        if (result.isErr()) continue;
        return false;
      }
    }
  }
  return true;
}
