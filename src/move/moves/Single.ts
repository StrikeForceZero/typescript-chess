import { CaptureType } from '../CaptureType';
import { Direction } from '../direction';
import {
  AbstractMove,

} from '../AbstractMove';
import { MoveType } from '../MoveType';

export class Single extends AbstractMove {
  constructor(
    direction: Direction,
  ) {
    super(
      MoveType.Single,
      direction,
      {
        capture: CaptureType.CanCapture,
        directionLimit: 1,
      },
    );
  }
}
