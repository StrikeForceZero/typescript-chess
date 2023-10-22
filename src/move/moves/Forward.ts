import {
  AnySimpleDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  CaptureType,
  AbstractMove,

} from '../moves';
import { MoveType } from '../MoveType';

export class Forward extends AbstractMove<ToDirection<AnySimpleDirection.North | AnySimpleDirection.South>> {
  constructor(
    direction: AnySimpleDirection.North | AnySimpleDirection.South,
  ) {
    super(
      MoveType.Forward,
      toDirection(direction),
      {
        capture: CaptureType.None,
        directionLimit: 1,
      },
    );
  }
}
