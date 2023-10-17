import { PieceType } from '../piece/PieceType';
import {
  AnySimpleDirection,
  DiagonalDirection,
  Direction,
  SimpleDirection,
  toDirection,
} from './direction';
import {
  All,
  Castle,
  DirectionOrDirectionArray,
  LJump,
  Move,
  Single,
} from './moves';

function mapAllDirections(callback: (direction: Direction) => Move): Move[] {
  return Object.values(Direction).map(callback);
}

function mapAllDiagonalDirections(callback: (direction: Direction) => Move): Move[] {
  return toDirection(Object.values(DiagonalDirection)).map(callback);
}

function mapAllSimpleDirections(callback: (direction: Direction) => Move): Move[] {
  return toDirection(Object.values(SimpleDirection)).map(callback);
}

function mapAllLJumpDirections(callback: (direction: readonly [AnySimpleDirection, AnySimpleDirection]) => Move<readonly [Direction, Direction]>): Move<readonly [Direction, Direction]>[] {
  return [
    [SimpleDirection.North, SimpleDirection.East] as const,
    [SimpleDirection.North, SimpleDirection.West] as const,

    [SimpleDirection.East, SimpleDirection.North] as const,
    [SimpleDirection.East, SimpleDirection.South] as const,

    [SimpleDirection.South, SimpleDirection.East] as const,
    [SimpleDirection.South, SimpleDirection.West] as const,

    [SimpleDirection.West, SimpleDirection.South] as const,
    [SimpleDirection.West, SimpleDirection.North] as const,
  ].map(callback);
}

function mapAllCastleDirections(callback: (direction: Direction.West | Direction.East) => Move): Move[] {
  return ([Direction.West, Direction.East] as const).map(callback);
}

export const PieceMoveMap = {
  // TODO: Pawns can only move in one direction
  [PieceType.Pawn]: [],
  [PieceType.Rook]: mapAllSimpleDirections(direction => new All(direction)),
  [PieceType.Knight]: mapAllLJumpDirections(direction => new LJump(direction)),
  [PieceType.Bishop]: mapAllDiagonalDirections(direction => new All(direction)),
  [PieceType.Queen]: mapAllDirections(direction => new All(direction)),
  [PieceType.King]: [
    ...mapAllDirections(direction => new Single(direction)),
    ...mapAllCastleDirections(direction => new Castle(direction)),
  ],
} satisfies Record<PieceType, Move<DirectionOrDirectionArray>[]>;
