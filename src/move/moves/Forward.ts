import {
  AnySimpleDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  CaptureType,
  Move,
  MoveType,
} from '../moves';

export class Forward extends Move<ToDirection<AnySimpleDirection.North | AnySimpleDirection.South>> {
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
