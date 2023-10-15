import {
  ColoredPieceContainer,
  isColoredPieceContainer,
} from '../../piece/ChessPiece';
import { Board } from '../Board';
import { BoardPosition } from '../BoardPosition';

export function getColoredPieceContainerOrThrow(board: Board, pos: BoardPosition): ColoredPieceContainer {
  const piece = board.getPieceFromPos(pos);
  if (!isColoredPieceContainer(piece)) {
    throw new Error(`no piece found at ${pos}`);
  }
  return piece;
}
