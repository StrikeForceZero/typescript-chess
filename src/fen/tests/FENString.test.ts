import {
  describe,
  expect,
  it,
  test,
} from '@jest/globals';
import {
  looksLikeFen,
  StandardStartPositionFEN,
} from '../FENString';

describe('FENString', () => {
  const emptyBoardFen = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
  it('looksLikeFen() should loosely validate fen strings', () => {
    // valid
    expect(looksLikeFen(StandardStartPositionFEN)).toBe(true);
    expect(looksLikeFen(emptyBoardFen)).toBe(true);
    // missing row
    expect(looksLikeFen('8/8/8/8/8/8/8 w KQkq - 0 1')).toBe(false);
    // invalid piece
    expect(looksLikeFen('x/8/8/8/8/8/8/8 w KQkq - 0 1')).toBe(false);
    // invalid move clocks
    expect(looksLikeFen('8/8/8/8/8/8/8/8 w KQkq - 0 0')).toBe(false);
    expect(looksLikeFen('8/8/8/8/8/8/8/8 w KQkq - 0 0')).toBe(false);
    expect(looksLikeFen('8/8/8/8/8/8/8/8 w KQkq - x 1')).toBe(false);
    // invalid color
    expect(looksLikeFen('8/8/8/8/8/8/8/8 x KQkq - 0 1')).toBe(false);
    expect(looksLikeFen('rnbqkbnr/pppp1ppp/8/4pP2/8/8/PPPPP1PP/RNBQKBNR w KQkq e6 0 1')).toBe(true);
  });
  const badlyFormattedFens = [...emptyBoardFen]
    .map((_, ix) => emptyBoardFen.substring(0, ix) + ' ' + emptyBoardFen.substring(ix + 1))
    // skip the first one since its just emptyBoardFen
    .slice(1);
  test.each([badlyFormattedFens])('checks that %j does not look like a fen', fen => {
    expect(looksLikeFen(fen)).toBe(false);
  });
});
