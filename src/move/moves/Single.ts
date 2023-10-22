import { Direction } from '../direction';
import {
  CaptureType,
  AbstractMove,

} from '../moves';
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
