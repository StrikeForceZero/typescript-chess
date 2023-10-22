import { CaptureType } from '../CaptureType';
import {
  AnyDiagonalDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  AbstractMove,

} from './AbstractMove';
import { MoveType } from '../MoveType';

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
