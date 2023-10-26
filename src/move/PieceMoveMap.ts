import { PieceColor } from '../piece/PieceColor';
import { PieceType } from '../piece/PieceType';
import {
  AnySimpleDirection,
  DiagonalDirection,
  Direction,
  SimpleDirection,
  toDirection,
} from './direction';
import { DirectionOrDirectionArray } from './MoveData';
import {
  AbstractMove,

} from './moves/AbstractMove';
import { All } from './moves/All';
import { Castle } from './moves/Castle';
import { Double } from './moves/Double';
import { Forward } from './moves/Forward';
import { LJump } from './moves/LJump';
import { PawnAttack } from './moves/PawnAttack';
import { Single } from './moves/Single';

function mapAllDirections(callback: (direction: Direction) => AbstractMove): AbstractMove[] {
  return Object.values(Direction).map(callback);
}

function mapAllDiagonalDirections(callback: (direction: Direction) => AbstractMove): AbstractMove[] {
  return toDirection(Object.values(DiagonalDirection)).map(callback);
}

function mapAllSimpleDirections(callback: (direction: Direction) => AbstractMove): AbstractMove[] {
  return toDirection(Object.values(SimpleDirection)).map(callback);
}

function mapAllLJumpDirections(callback: (direction: readonly [AnySimpleDirection, AnySimpleDirection]) => AbstractMove<readonly [Direction, Direction]>): AbstractMove<readonly [Direction, Direction]>[] {
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

function mapAllCastleDirections(callback: (direction: Direction.West | Direction.East) => AbstractMove): AbstractMove[] {
  return (
    [Direction.West, Direction.East] as const
  ).map(callback);
}

const WhitePawnMoves = [
  new Forward(Direction.North),
  new Double(Direction.North),
  new PawnAttack(DiagonalDirection.NorthWest),
  new PawnAttack(DiagonalDirection.NorthEast),
] as const;

const BlackPawnMoves = [
  new Forward(Direction.South),
  new Double(Direction.South),
  new PawnAttack(DiagonalDirection.SouthWest),
  new PawnAttack(DiagonalDirection.SouthEast),
] as const;

const PawnColorMoveMap = {
  [PieceColor.White]: WhitePawnMoves,
  [PieceColor.Black]: BlackPawnMoves,
} as const satisfies Record<PieceColor, readonly AbstractMove[]>;

const PawnMoves: readonly AbstractMove[] = [...BlackPawnMoves, ...WhitePawnMoves];
const RookMoves: readonly AbstractMove[] = mapAllSimpleDirections(direction => new All(direction));
const KnightMoves: readonly AbstractMove<readonly [Direction, Direction]>[] = mapAllLJumpDirections(direction => new LJump(direction));
const BishopMoves: readonly AbstractMove[] = mapAllDiagonalDirections(direction => new All(direction));
const QueenMoves: readonly AbstractMove[] = mapAllDirections(direction => new All(direction));
const KingMoves: readonly AbstractMove[] = [
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
} as const satisfies Record<PieceType, (color?: PieceColor) => readonly AbstractMove<DirectionOrDirectionArray>[]>;

export function resolveMoves(pieceType: PieceType, color: PieceColor): AbstractMove<DirectionOrDirectionArray>[] {
  return PieceMoveMap[pieceType](color).flat();
}
