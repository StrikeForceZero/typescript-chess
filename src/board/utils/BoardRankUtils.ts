import { assertExhaustive } from '../../utils/assert';
import { BoardRank } from '../BoardRank';

export function next(boardRank: BoardRank, wrapAround: boolean = false): BoardRank | null {
  return nextBoardRank(boardRank, wrapAround);
}

export function prev(boardRank: BoardRank, wrapAround: boolean = false): BoardRank | null {
  return prevBoardRank(boardRank, wrapAround);
}

export function nextBoardRank(boardRank: BoardRank, wrapAround: boolean = false): BoardRank | null {
  switch (boardRank) {
    case BoardRank.ONE: return BoardRank.TWO;
    case BoardRank.TWO: return BoardRank.THREE;
    case BoardRank.THREE: return BoardRank.FOUR;
    case BoardRank.FOUR: return BoardRank.FIVE;
    case BoardRank.FIVE: return BoardRank.SIX;
    case BoardRank.SIX: return BoardRank.SEVEN;
    case BoardRank.SEVEN: return BoardRank.EIGHT;
    case BoardRank.EIGHT: return wrapAround ? BoardRank.ONE : null;
    default: return assertExhaustive(boardRank, 'BoardRank');
  }
}

export function prevBoardRank(boardRank: BoardRank, wrapAround: boolean = false): BoardRank | null {
  switch (boardRank) {
    case BoardRank.EIGHT: return BoardRank.SEVEN;
    case BoardRank.SEVEN: return BoardRank.SIX;
    case BoardRank.SIX: return BoardRank.FIVE;
    case BoardRank.FIVE: return BoardRank.FOUR;
    case BoardRank.FOUR: return BoardRank.THREE;
    case BoardRank.THREE: return BoardRank.TWO;
    case BoardRank.TWO: return BoardRank.ONE;
    case BoardRank.ONE: return wrapAround ? BoardRank.EIGHT : null;
    default: return assertExhaustive(boardRank, 'BoardRank');
  }
}

export function* boardRankGenerator(start: BoardRank = BoardRank.ONE, wrapAround: boolean = false): Generator<BoardRank> {
  let currentRank = start;

  while (true) {
    yield currentRank;
    const nextValue = next(currentRank, wrapAround);
    if (nextValue === null) {
      return;
    }
    currentRank = nextValue;
  }
}

export function* boardRankReverseGenerator(start: BoardRank = BoardRank.EIGHT, wrapAround: boolean = false): Generator<BoardRank> {
  let currentRank = start;

  while (true) {
    yield currentRank;
    const nextValue = prev(currentRank, wrapAround);
    if (nextValue === null) {
      return;
    }
    currentRank = nextValue;
  }
}
