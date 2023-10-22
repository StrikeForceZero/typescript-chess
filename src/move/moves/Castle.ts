import { CaptureType } from '../CaptureType';
import {
  AnyDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  AbstractMove,

} from '../AbstractMove';
import { MoveType } from '../MoveType';

export class Castle extends AbstractMove<ToDirection<AnyDirection.East | AnyDirection.West>> {
  constructor(
    direction: AnyDirection.East | AnyDirection.West,
  ) {
    super(
      MoveType.Castle,
      toDirection(direction),
      {
        capture: CaptureType.None,
        onlyFromStartingPos: true,
        directionLimit: 2,
      },
    );
  }
}
