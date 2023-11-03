import {
  AnyDirection,
  Direction,
} from '../../move/direction';
import { ChessPiece } from '../../piece/ChessPiece';
import { Option } from '../../utils/Option';
import { Board } from '../Board';
import { BoardFile } from '../BoardFile';
import { BoardPosition } from '../BoardPosition';
import { BoardRank } from '../BoardRank';
import {
  nextBoardFile,
  prevBoardFile,
} from './BoardFileUtils';
import {
  nextBoardRank,
  prevBoardRank,
} from './BoardRankUtils';

type DirectionMap<T> = Record<Direction, T>;

export function createDirectionMap<T>(map: Partial<DirectionMap<T>>, defaultValue: T): DirectionMap<T> {
  return {
    [Direction.North]: map[Direction.North] ?? defaultValue,
    [Direction.NorthEast]: map[Direction.NorthEast] ?? defaultValue,
    [Direction.East]: map[Direction.East] ?? defaultValue,
    [Direction.SouthEast]: map[Direction.SouthEast] ?? defaultValue,
    [Direction.South]: map[Direction.South] ?? defaultValue,
    [Direction.SouthWest]: map[Direction.SouthWest] ?? defaultValue,
    [Direction.West]: map[Direction.West] ?? defaultValue,
    [Direction.NorthWest]: map[Direction.NorthWest] ?? defaultValue,
  };
}

type DirectionMapValueFn<T> = ((from: T) => T | null)

const boardFileDirectionMap = createDirectionMap<DirectionMapValueFn<BoardFile>>({
  [Direction.NorthWest]: from => prevBoardFile(from),
  [Direction.SouthWest]: from => prevBoardFile(from),
  [Direction.West]: from => prevBoardFile(from),

  [Direction.East]: from => nextBoardFile(from),
  [Direction.NorthEast]: from => nextBoardFile(from),
  [Direction.SouthEast]: from => nextBoardFile(from),
}, from => from);

const boardRankDirectionMap = createDirectionMap<DirectionMapValueFn<BoardRank>>({
  [Direction.North]: from => nextBoardRank(from),
  [Direction.NorthWest]: from => nextBoardRank(from),
  [Direction.NorthEast]: from => nextBoardRank(from),

  [Direction.South]: from => prevBoardRank(from),
  [Direction.SouthWest]: from => prevBoardRank(from),
  [Direction.SouthEast]: from => prevBoardRank(from),
}, from => from);

export function resolveNextBoardFile(fromBoardFile: BoardFile, direction: AnyDirection): BoardFile | null {
  return boardFileDirectionMap[direction](fromBoardFile);
}

export function resolveNextBoardRank(fromBoardRank: BoardRank, direction: AnyDirection): BoardRank | null {
  return boardRankDirectionMap[direction](fromBoardRank);
}

export function nextBoardPos(fromBoardPos: BoardPosition, direction: AnyDirection): BoardPosition | null {
  const nextBoardFile = resolveNextBoardFile(fromBoardPos.file, direction);
  const nextBoardRank = resolveNextBoardRank(fromBoardPos.rank, direction);
  if (!nextBoardFile || !nextBoardRank) {
    return null;
  }
  return new BoardPosition(nextBoardFile, nextBoardRank);
}

export type BoardScannerOptions = {
  limit?: number | null,
  stopOnPiece?: boolean,
};

export type BoardScannerResult = { pos: BoardPosition, piece: Option<ChessPiece> };
export function *boardScanner(
  board: Board,
  startingPosition: BoardPosition,
  direction: AnyDirection,
  {
    limit = null,
    stopOnPiece = false,
  }: BoardScannerOptions = {}
): Generator<BoardScannerResult, undefined> {
  let nextPos: BoardPosition | null = startingPosition;
  while (limit === null || limit-- > 0) {
    nextPos = nextBoardPos(nextPos, direction);
    if (!nextPos) return;
    const piece = board.getPieceFromPos(nextPos);
    yield {
      pos: nextPos,
      piece,
    };
    if (piece.isSome() && stopOnPiece) {
      return;
    }
  }
}
