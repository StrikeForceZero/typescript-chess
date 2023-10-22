import {
  AnyDiagonalDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  CaptureType,
  AbstractMove,
  MoveType,
} from '../moves';

export class PawnAttack extends AbstractMove<ToDirection<AnyDiagonalDirection | AnyDiagonalDirection>> {
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
