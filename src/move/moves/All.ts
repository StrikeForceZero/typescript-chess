import { Direction } from '../direction';
import {
  CaptureType,
  AbstractMove,

} from '../moves';
import { MoveType } from '../MoveType';

export class All extends AbstractMove {
  constructor(
    direction: Direction,
  ) {
    super(
      MoveType.All,
      direction,
      {
        capture: CaptureType.CanCapture,
        directionLimit: 7,
      },
    );
  }
}
