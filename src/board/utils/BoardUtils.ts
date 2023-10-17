import {
  ChessPieceColored,
  isColoredPieceContainer,
} from '../../piece/ChessPiece';
import { Board } from '../Board';
import { BoardPosition } from '../BoardPosition';

export function getChessPieceColoredOrThrow(board: Board, pos: BoardPosition): ChessPieceColored {
  const piece = board.getPieceFromPos(pos);
  if (!isColoredPieceContainer(piece)) {
    throw new Error(`no piece found at ${pos}`);
  }
  return piece;
}
