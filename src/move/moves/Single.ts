import { Direction } from '../direction';
import {
  CaptureType,
  AbstractMove,
  MoveType,
} from '../moves';

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
