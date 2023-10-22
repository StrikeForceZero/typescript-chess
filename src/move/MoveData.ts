import { BoardPosition } from '../board/BoardPosition';
import { CaptureType } from './CaptureType';
import { Direction } from './direction';
import { MoveType } from './MoveType';

export type DirectionLimit =
  1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7;
export type MoveMeta<TDirection extends DirectionOrDirectionArray = DirectionOrDirectionArray> = {
  readonly capture: CaptureType,
  readonly directionLimit: TDirection extends Direction ? DirectionLimit : readonly [DirectionLimit, DirectionLimit],
  readonly onlyFromStartingPos?: true,
  readonly ignoresBlockingPieces?: true,
  readonly onlyFinalPositionIsValid?: true,
}
export type DirectionOrDirectionArray =
  Direction
  | readonly [Direction, Direction];
export type MoveData<TDirection extends DirectionOrDirectionArray = DirectionOrDirectionArray> = {
  readonly moveType: MoveType,
  readonly sourcePos: BoardPosition,
  readonly direction: TDirection,
  readonly moveMeta: MoveMeta<TDirection>,
}
