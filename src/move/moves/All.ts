import { Direction } from '../direction';
import {
  CaptureType,
  AbstractMove,
  MoveType,
} from '../moves';

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
