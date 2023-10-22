import { CaptureType } from '../CaptureType';
import {
  AnySimpleDirection,
  toDirection,
  ToDirectionArray,
} from '../direction';
import {
  AbstractMove,

} from '../AbstractMove';
import { MoveType } from '../MoveType';

export class LJump extends AbstractMove<ToDirectionArray<readonly [AnySimpleDirection, AnySimpleDirection]>> {
  constructor(
    direction: readonly [AnySimpleDirection, AnySimpleDirection],
  ) {
    super(
      MoveType.LJump,
      toDirection(direction),
      {
        capture: CaptureType.CanCapture,
        directionLimit: [1, 2],
        ignoresBlockingPieces: true,
        onlyFinalPositionIsValid: true,
      },
    );
  }
}
