import { BoardFile } from '../BoardFile';

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
    }
  }
}
