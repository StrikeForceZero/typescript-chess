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
