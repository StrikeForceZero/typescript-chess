import { deserializeBoardOnlyFENString } from '../../fen/deserializer';
import { StandardStartPositionBoardOnlyFEN } from '../../fen/FENString';
import { serializeBoardOnlyFENString } from '../../fen/serialize';
import {
  ChessPieceColored,
  isColoredPieceContainer,
} from '../../piece/ChessPiece';
import { deepFreeze } from '../../utils/deepFreeze';
import { Board } from '../Board';
import { BoardPosition } from '../BoardPosition';

export function getChessPieceColoredOrThrow(board: Board, pos: BoardPosition): ChessPieceColored {
  const piece = board.getPieceFromPos(pos);
  if (!isColoredPieceContainer(piece)) {
    throw new Error(`no piece found at ${pos}`);
  }
  return piece;
}

export function isBoardAtStartingPos(board: Board): boolean {
  return serializeBoardOnlyFENString(board) === StandardStartPositionBoardOnlyFEN;
}

const startingPosBoard = deepFreeze(deserializeBoardOnlyFENString(StandardStartPositionBoardOnlyFEN));
// will return true for comparing empty squares A3-F8
export function isPieceAtStartingPos(board: Board, pos: BoardPosition): boolean {
  return startingPosBoard.getPieceFromPos(pos) === board.getPieceFromPos(pos);
}
