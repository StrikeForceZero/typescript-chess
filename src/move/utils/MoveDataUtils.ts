// TODO: does readonly break Array.isArray type guards?
import { ensureArray } from '../../utils/array';
import { zipExact } from '../../utils/zip';
import { Direction } from '../direction';
import {
  DirectionLimit,
  DirectionOrDirectionArray,
  MoveData,
} from '../MoveData';

export function isDirectionTuple(direction: DirectionOrDirectionArray): direction is readonly [Direction, Direction] {
  return Array.isArray(direction);
}

export function extractDirectionAndLimitTuples(moveData: MoveData): Iterable<readonly [Direction, DirectionLimit]> {
  return zipExact(ensureArray<Direction>(moveData.direction), ensureArray(moveData.moveMeta.directionLimit));
}
