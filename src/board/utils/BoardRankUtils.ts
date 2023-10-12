import { BoardRank } from '../BoardRank';

export function* boardRankGenerator(start: BoardRank = BoardRank.ONE, wrapAround: boolean = false): Generator<BoardRank> {
  let currentRank = start;

  while (true) {
    yield currentRank;

    if (currentRank === BoardRank.EIGHT) {
      if (wrapAround) {
        currentRank = BoardRank.ONE;
        continue;
      } else {
        return; // Ends the generator
      }
    }
    currentRank++;
  }
}

export function* boardRankReverseGenerator(start: BoardRank = BoardRank.EIGHT, wrapAround: boolean = false): Generator<BoardRank> {
  let currentRank = start;

  while (true) {
    yield currentRank;

    if (currentRank === BoardRank.ONE) {
      if (wrapAround) {
        currentRank = BoardRank.EIGHT;
        continue;
      } else {
        return; // Ends the generator
      }
    }
    currentRank--;
  }
}
