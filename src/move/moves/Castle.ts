import {
  AnyDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  CaptureType,
  AbstractMove,

} from '../moves';
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
