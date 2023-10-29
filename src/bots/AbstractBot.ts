import { Game } from '../game/Game';
import { MoveResult } from '../move/move';
import { PieceColor } from '../piece/PieceColor';
import { Result } from '../utils/Result';

export abstract class AbstractBot {
  constructor(
    protected readonly playAsColor: PieceColor,
    protected readonly game: Game,
  ) {
  }

  public abstract handleTurn(): Result<MoveResult, unknown>;
}
