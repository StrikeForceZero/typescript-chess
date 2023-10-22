import { Direction } from '../direction';
import {
  CaptureType,
  Move,
  MoveType,
} from '../moves';

export class Single extends Move {
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
