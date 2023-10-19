import { BoardPosition } from './BoardPosition';
import {
  ChessPiece,
  NoPiece,
} from '../piece/ChessPiece';

export class BoardSquare {
  public readonly pos: BoardPosition;
  public piece: ChessPiece;

  public constructor(pos: BoardPosition, piece: ChessPiece = NoPiece) {
    this.pos = pos;
    this.piece = piece;
  }
}
