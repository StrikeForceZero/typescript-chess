import {
  AnySimpleDirection,
  toDirection,
  ToDirectionArray,
} from '../direction';
import {
  CaptureType,
  Move,
  MoveType,
} from '../moves';

export class LJump extends Move<ToDirectionArray<readonly [AnySimpleDirection, AnySimpleDirection]>> {
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
