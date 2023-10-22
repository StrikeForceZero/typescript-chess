import { CaptureType } from '../CaptureType';
import {
  AnySimpleDirection,
  toDirection,
  ToDirection,
} from '../direction';
import {
  AbstractMove,

} from './AbstractMove';
import { MoveType } from '../MoveType';

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
