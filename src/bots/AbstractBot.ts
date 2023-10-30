import { Game } from '../game/Game';
import { MoveResult } from '../move/move';
import { PieceColor } from '../piece/PieceColor';
import { Result } from '../utils/Result';

export abstract class AbstractBot {
  constructor(
    protected readonly playAsColor: PieceColor,
  ) {
  }

  public abstract handleTurn(game: Game): Result<MoveResult, unknown>;
}
