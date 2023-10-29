import { BoardPos } from '../board/BoardPositionIdentifer';
import { deserialize } from '../fen/deserializer';
import { StandardStartPositionFEN } from '../fen/FENString';
import {
  move,
  MoveResult,
} from '../move/move';
import { PieceType } from '../piece/PieceType';
import { Result } from '../utils/Result';

export class Game {
  public readonly gameState = deserialize(StandardStartPositionFEN);
  public move(from: BoardPos, to: BoardPos, promoteToPieceType?: PieceType): Result<MoveResult, unknown> {
    return Result.capture(() => move(this.gameState, from, to, promoteToPieceType));
  }
}
