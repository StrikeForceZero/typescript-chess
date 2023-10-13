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

    switch (currentFile) {
      case BoardFile.A:
        currentFile = BoardFile.B;
        break;
      case BoardFile.B:
        currentFile = BoardFile.C;
        break;
      case BoardFile.C:
        currentFile = BoardFile.D;
        break;
      case BoardFile.D:
        currentFile = BoardFile.E;
        break;
      case BoardFile.E:
        currentFile = BoardFile.F;
        break;
      case BoardFile.F:
        currentFile = BoardFile.G;
        break;
      case BoardFile.G:
        currentFile = BoardFile.H;
        break;
      case BoardFile.H:
        if (wrapAround) {
          currentFile = BoardFile.A;
        } else {
          return; // Ends the generator
        }
        break;
      default: return assertExhaustive(currentFile, 'BoardFile');
    }
  }
}

export function* boardFileReverseGenerator(start: BoardFile = BoardFile.H, wrapAround: boolean = false): Generator<BoardFile> {
  let currentFile = start;

  while (true) {
    yield currentFile;

    switch (currentFile) {
      case BoardFile.A:
        if (wrapAround) {
          currentFile = BoardFile.H;
        } else {
          return; // Ends the generator
        }
        break;
      case BoardFile.B:
        currentFile = BoardFile.A;
        break;
      case BoardFile.C:
        currentFile = BoardFile.B;
        break;
      case BoardFile.D:
        currentFile = BoardFile.C;
        break;
      case BoardFile.E:
        currentFile = BoardFile.D;
        break;
      case BoardFile.F:
        currentFile = BoardFile.E;
        break;
      case BoardFile.G:
        currentFile = BoardFile.F;
        break;
      case BoardFile.H:
        currentFile = BoardFile.G;
        break;
      default: return assertExhaustive(currentFile, 'BoardFile');
    }
  }
}
