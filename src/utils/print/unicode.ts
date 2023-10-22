import { Board } from '../../board/Board';
import { BoardFile } from '../../board/BoardFile';
import { BoardRank } from '../../board/BoardRank';
import { prevBoardRank } from '../../board/utils/BoardRankUtils';
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

// TODO: another function should be responsible for building the string
export function printBoardToUnicode(board: Board, showFileRank = false): void {
  let rank: BoardRank = BoardRank.EIGHT;
  if (showFileRank) console.log('  ' + Object.values(BoardFile).join(''));
  for (const row of boardToUnicode(board)) {
    const boardRow = row.join('');
    if (showFileRank) {
      console.log(`${rank} ${boardRow} ${rank}`);
    } else {
      console.log(boardRow);
    }
    rank = prevBoardRank(rank, true);
  }
  if (showFileRank) console.log('  ' + Object.values(BoardFile).join(''));
}

export function chessPieceToUnicode(chessPiece: ChessPiece): string {
  if (!isColoredPieceContainer(chessPiece)) {
    return ' ';
  }
  const color = chessPiece.coloredPiece.color;
  const pieceType = chessPiece.coloredPiece.pieceType;
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

