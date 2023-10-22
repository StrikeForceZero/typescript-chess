import { match } from 'ts-pattern';
import { BoardFile } from '../BoardFile';

export function next(boardRank: BoardFile, wrapAround: true): BoardFile;
export function next(boardRank: BoardFile, wrapAround: boolean): BoardFile | null;
export function next(boardRank: BoardFile, wrapAround: boolean = false): BoardFile | null {
  return nextBoardFile(boardRank, wrapAround);
}

export function prev(boardRank: BoardFile, wrapAround: true): BoardFile;
export function prev(boardRank: BoardFile, wrapAround: boolean): BoardFile | null;
export function prev(boardRank: BoardFile, wrapAround: boolean = false): BoardFile | null {
  return prevBoardFile(boardRank, wrapAround);
}

export function nextBoardFile(boardFile: BoardFile, wrapAround: true): BoardFile;
export function nextBoardFile(boardFile: BoardFile, wrapAround: boolean): BoardFile | null;
export function nextBoardFile(boardFile: BoardFile, wrapAround: boolean = false): BoardFile | null {
  return match(boardFile)
    .with(BoardFile.A, _ => BoardFile.B)
    .with(BoardFile.B, _ => BoardFile.C)
    .with(BoardFile.C, _ => BoardFile.D)
    .with(BoardFile.D, _ => BoardFile.E)
    .with(BoardFile.E, _ => BoardFile.F)
    .with(BoardFile.F, _ => BoardFile.G)
    .with(BoardFile.G, _ => BoardFile.H)
    .with(BoardFile.H, _ => wrapAround ? BoardFile.A : null)
    .exhaustive();
}

export function prevBoardFile(boardFile: BoardFile, wrapAround: true): BoardFile;
export function prevBoardFile(boardFile: BoardFile, wrapAround: boolean): BoardFile | null;
export function prevBoardFile(boardFile: BoardFile, wrapAround: boolean = false): BoardFile | null {
  return match(boardFile)
    .with(BoardFile.H, _ => BoardFile.G)
    .with(BoardFile.G, _ => BoardFile.F)
    .with(BoardFile.F, _ => BoardFile.E)
    .with(BoardFile.E, _ => BoardFile.D)
    .with(BoardFile.D, _ => BoardFile.C)
    .with(BoardFile.C, _ => BoardFile.B)
    .with(BoardFile.B, _ => BoardFile.A)
    .with(BoardFile.A, _ => wrapAround ? BoardFile.H : null)
    .exhaustive();
}

export function* boardFileGenerator(start: BoardFile = BoardFile.A, wrapAround: boolean = false): Generator<BoardFile> {
  let currentFile = start;

  while (true) {
    yield currentFile;
    const nextValue = next(currentFile, wrapAround);
    if (nextValue === null) {
      return;
    }
    currentFile = nextValue;
  }
}

export function* boardFileReverseGenerator(start: BoardFile = BoardFile.H, wrapAround: boolean = false): Generator<BoardFile> {
  let currentFile = start;

  while (true) {
    yield currentFile;
    const nextValue = prev(currentFile, wrapAround);
    if (nextValue === null) {
      return;
    }
    currentFile = nextValue;
  }
}
