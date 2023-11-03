import { Option } from '../utils/Option';
import { BoardPosition } from './BoardPosition';
import { ChessPiece } from '../piece/ChessPiece';

export class BoardSquare {
  public readonly pos: BoardPosition;
  public piece: Option<ChessPiece>;

  public constructor(pos: BoardPosition, piece: Option<ChessPiece> = Option.None()) {
    this.pos = pos;
    this.piece = piece;
  }
}
