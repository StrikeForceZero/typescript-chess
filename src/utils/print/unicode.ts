import { Board } from '../../board/Board';
import { BoardFile } from '../../board/BoardFile';
import {
  ChessPiece,
  isColoredPieceContainer,
} from '../../piece/ChessPiece';
import { PieceColor } from '../../piece/PieceColor';
import { PieceType } from '../../piece/PieceType';

export function boardToUnicode(board: Board): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  for (const square of board) {
    row.push(chessPieceToUnicode(square.piece));
    if (square.pos.file === BoardFile.H) {
      rows.push(row);
      row = [];
    }
  }
  // reverse because we print top down
  return rows.reverse();
}

export function printBoardToUnicode(board: Board): void {
  for (const row of boardToUnicode(board)) {
    console.log(row.join(''));
  }
}

export function chessPieceToUnicode(chessPiece: ChessPiece): string {
  if (!isColoredPieceContainer(chessPiece)) {
    return ' ';
  }
  const color = chessPiece.piece.color;
  const pieceType = chessPiece.piece.type;
  switch (color) {
    case PieceColor.White:
      switch (pieceType) {
        case PieceType.Pawn: return '♙';
        case PieceType.Rook: return '♖';
        case PieceType.Knight: return '♘';
        case PieceType.Bishop: return '♗';
        case PieceType.Queen: return '♕';
        case PieceType.King: return '♔';
        default: throw new Error(`Invalid PieceType: ${pieceType}`);
      }
    case PieceColor.Black:
      switch (pieceType) {
        case PieceType.Pawn: return '♟';
        case PieceType.Rook: return '♜';
        case PieceType.Knight: return '♞';
        case PieceType.Bishop: return '♝';
        case PieceType.Queen: return '♛';
        case PieceType.King: return '♚';
        default: throw new Error(`Invalid PieceType: ${pieceType}`);
      }
    default: throw new Error(`Invalid PieceColor: ${color}`);
  }
}

