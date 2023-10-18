import { PieceColor } from '../piece/PieceColor';
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
  Double,
  EnPassant,
  Forward,
  LJump,
  Move,
  PawnAttack,
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

const WhitePawnMoves = [
  new Forward(Direction.North),
  new Double(Direction.North),
  new PawnAttack(DiagonalDirection.NorthWest),
  new PawnAttack(DiagonalDirection.NorthEast),
  new EnPassant(DiagonalDirection.NorthEast),
  new EnPassant(DiagonalDirection.NorthWest),
] as const;

const BlackPawnMoves = [
  new Forward(Direction.South),
  new Double(Direction.South),
  new PawnAttack(DiagonalDirection.SouthWest),
  new PawnAttack(DiagonalDirection.SouthEast),
  new EnPassant(DiagonalDirection.SouthEast),
  new EnPassant(DiagonalDirection.SouthWest),
] as const;

const PawnColorMoveMap = {
  [PieceColor.White]: WhitePawnMoves,
  [PieceColor.Black]: BlackPawnMoves,
} as const satisfies Record<PieceColor, readonly Move[]>;

const PawnMoves: readonly Move[] = [ ...BlackPawnMoves, ...WhitePawnMoves];
const RookMoves: readonly Move[] = mapAllSimpleDirections(direction => new All(direction));
const KnightMoves: readonly Move<readonly [Direction, Direction]>[] = mapAllLJumpDirections(direction => new LJump(direction));
const BishopMoves: readonly Move[] = mapAllDiagonalDirections(direction => new All(direction));
const QueenMoves: readonly Move[] = mapAllDirections(direction => new All(direction));
const KingMoves: readonly Move[] = [
  ...mapAllDirections(direction => new Single(direction)),
  ...mapAllCastleDirections(direction => new Castle(direction)),
];

export const PieceMoveMap = {
  [PieceType.Pawn]: color => color ? PawnColorMoveMap[color] : PawnMoves,
  [PieceType.Rook]: _ => RookMoves,
  [PieceType.Knight]: _ => KnightMoves,
  [PieceType.Bishop]: _ => BishopMoves,
  [PieceType.Queen]: _ => QueenMoves,
  [PieceType.King]: _ => KingMoves,
} as const satisfies Record<PieceType, (color?: PieceColor) => readonly Move<DirectionOrDirectionArray>[]>;
