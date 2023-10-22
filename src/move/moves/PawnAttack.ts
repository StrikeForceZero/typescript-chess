import {
  AnyDiagonalDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  CaptureType,
  Move,
  MoveType,
} from '../moves';

export class PawnAttack extends Move<ToDirection<AnyDiagonalDirection | AnyDiagonalDirection>> {
  constructor(
    direction: AnyDiagonalDirection,
  ) {
    super(
      MoveType.PawnAttack,
      toDirection(direction),
      {
        capture: CaptureType.CaptureOnly,
        directionLimit: 1,
      },
    );
  }
}
