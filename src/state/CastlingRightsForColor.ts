import { CastleSide } from '../board/CastleSide';
import { assertExhaustive } from '../utils/assert';

export class CastlingRightsForColor {
  public kingSide: boolean = true;
  public queenSide: boolean = true;

  public get(side: CastleSide): boolean {
    switch (side) {
      case CastleSide.QueenSide: return this.queenSide;
      case CastleSide.KingSide: return this.kingSide;
      default: return assertExhaustive(side);
    }
  }

  public set(side: CastleSide, state: boolean): void {
    switch (side) {
      case CastleSide.QueenSide: this.queenSide = state; break;
      case CastleSide.KingSide: this.kingSide = state; break;
      default: assertExhaustive(side);
    }
  }
}
