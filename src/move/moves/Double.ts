import {
  AnySimpleDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  CaptureType,
  AbstractMove,
  MoveType,
} from '../moves';

export class Double extends AbstractMove<ToDirection<AnySimpleDirection.North | AnySimpleDirection.South>> {
  constructor(
    direction: AnySimpleDirection.North | AnySimpleDirection.South,
  ) {
    super(
      MoveType.Double,
      toDirection(direction),
      {
        capture: CaptureType.None,
        onlyFromStartingPos: true,
        onlyFinalPositionIsValid: true,
        directionLimit: 2,
      },
    );
  }
}
