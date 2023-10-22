import {
  AnyDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  CaptureType,
  Move,
  MoveType,
} from '../moves';

export class Castle extends Move<ToDirection<AnyDirection.East | AnyDirection.West>> {
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
