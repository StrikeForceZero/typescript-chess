import { BoardPos } from '../board/BoardPositionIdentifer';
import { deserialize } from '../fen/deserializer';
import { StandardStartPositionFEN } from '../fen/FENString';
import {
  MatchedMove,
  move,
} from '../move/move';
import { Result } from '../utils/Result';

export class Game {
  public readonly gameState = deserialize(StandardStartPositionFEN);
  public move(from: BoardPos, to: BoardPos): Result<MatchedMove, unknown> {
    return Result.capture(() => move(this.gameState, from, to));
  }
}
