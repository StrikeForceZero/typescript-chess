import { CaptureType } from '../CaptureType';
import { Direction } from '../direction';
import {
  AbstractMove,

} from './AbstractMove';
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
