import { Direction } from '../direction';
import {
  CaptureType,
  Move,
  MoveType,
} from '../moves';

export class All extends Move {
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
