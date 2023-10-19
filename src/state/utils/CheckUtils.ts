import { deserialize } from '../../fen/deserializer';
import { serialize } from '../../fen/serialize';
import { performMove as standardMoveHandler } from '../../move/performMove';
import { PieceMoveMap } from '../../move/PieceMoveMap';
import { ChessPiece } from '../../piece/ChessPiece';
import { PieceType } from '../../piece/PieceType';
import { GameState } from '../GameState';

export function isCheck(gameState: GameState, activeColor = gameState.activeColor): boolean {
  for (const square of gameState.board) {
    if (!ChessPiece.ColoredPiece.is(square.piece)) continue;
    // skip current player pieces
    if (square.piece.coloredPiece.color === activeColor) continue;
    const moves = PieceMoveMap[square.piece.coloredPiece.pieceType](square.piece.coloredPiece.color);
    for (const move of moves) {
      const validMoves = move.test(gameState, square.pos);
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

export function isCheckMate(gameState: GameState): boolean {
  if (!isCheck(gameState)) return false;
  for (const square of gameState.board) {
    if (!ChessPiece.ColoredPiece.is(square.piece)) continue;
    // only check player in check
    if (square.piece.coloredPiece.color !== gameState.activeColor) continue;
    const moves = PieceMoveMap[square.piece.coloredPiece.pieceType](square.piece.coloredPiece.color);
    for (const move of moves) {
      const validMoves = move.test(gameState, square.pos);
      for (const validMove of validMoves) {
        const gameStateCopy = deserialize(serialize(gameState));
        const result = validMove.tryExec(gameStateCopy, standardMoveHandler, false);
        if (result.isErr()) continue;
        if (isCheck(gameStateCopy, gameState.activeColor)) continue;
        return false;
      }
    }
  }
  return true;
}

export function isStalemate(gameState: GameState): boolean {
  if (isCheck(gameState)) return false;
  for (const square of gameState.board) {
    if (!ChessPiece.ColoredPiece.is(square.piece)) continue;
    // only check player in check
    if (square.piece.coloredPiece.color !== gameState.activeColor) continue;
    const moves = PieceMoveMap[square.piece.coloredPiece.pieceType](square.piece.coloredPiece.color);
    for (const move of moves) {
      const validMoves = move.test(gameState, square.pos);
      for (const validMove of validMoves) {
        const gameStateCopy = deserialize(serialize(gameState));
        const result = validMove.tryExec(gameStateCopy, standardMoveHandler, false);
        if (result.isErr()) continue;
        if (isCheck(gameStateCopy, gameState.activeColor)) continue;
        return false;
      }
    }
  }
  return true;
}
