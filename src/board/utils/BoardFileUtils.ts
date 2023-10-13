import { assertExhaustive } from '../../utils/assert';
import { BoardFile } from '../BoardFile';

export function next(boardRank: BoardFile, wrapAround: boolean = false): BoardFile | null {
  return nextBoardFile(boardRank, wrapAround);
}

export function prev(boardRank: BoardFile, wrapAround: boolean = false): BoardFile | null {
  return prevBoardFile(boardRank, wrapAround);
}

export function nextBoardFile(boardFile: BoardFile, wrapAround: boolean = false): BoardFile | null {
  switch (boardFile) {
    case BoardFile.A: return BoardFile.B;
    case BoardFile.B: return BoardFile.C;
    case BoardFile.C: return BoardFile.D;
    case BoardFile.D: return BoardFile.E;
    case BoardFile.E: return BoardFile.F;
    case BoardFile.F: return BoardFile.G;
    case BoardFile.G: return BoardFile.H;
    case BoardFile.H: return wrapAround ? BoardFile.A : null;
    default: return assertExhaustive(boardFile, 'BoardFile');
  }
}

export function prevBoardFile(boardFile: BoardFile, wrapAround: boolean = false): BoardFile | null {
  switch (boardFile) {
    case BoardFile.H: return BoardFile.G;
    case BoardFile.G: return BoardFile.F;
    case BoardFile.F: return BoardFile.E;
    case BoardFile.E: return BoardFile.D;
    case BoardFile.D: return BoardFile.C;
    case BoardFile.C: return BoardFile.B;
    case BoardFile.B: return BoardFile.A;
    case BoardFile.A: return wrapAround ? BoardFile.H : null;
    default: return assertExhaustive(boardFile, 'BoardFile');
  }
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
