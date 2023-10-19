import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { deserialize } from '../../../fen/deserializer';
import {
  FENString,
  StandardStartPositionFEN,
} from '../../../fen/FENString';
import {
  isCheck,
  isCheckMate,
  isStalemate,
} from '../CheckUtils';

describe('CheckUtils', () => {
  it('should report isCheck correctly', () => {
    // Starting POS
    expect(isCheck(deserialize(StandardStartPositionFEN))).toBe(false);

    // Check: Black's king on e8, White's rook on e1, and it's Black's move.
    expect(isCheck(deserialize('4k3/8/8/8/8/8/8/4R3 b - - 0 1' as FENString))).toBe(true);

    // Check: White's king on e1, Black's rook on e8, and it's White's move.
    expect(isCheck(deserialize('4r3/8/8/8/8/8/8/4K3 w - - 0 1' as FENString))).toBe(true);

    // Not Checkmate (but still in check): White's king on e1, Black's rook on e8, Black's bishop on b5, and it's White's move.
    expect(isCheck(deserialize('4r3/8/8/1b6/8/8/8/4K3 w - - 0 1' as FENString))).toBe(true);

    // Not Checkmate and not in check: White's king on e1, Black's rook on e7, and it's White's move.
    expect(isCheck(deserialize('8/4r3/8/8/8/8/8/4K3 w - - 0 1' as FENString))).toBe(true);

    // Check: Black's king on e8, White's bishop on a4, and it's Black's move.
    expect(isCheck(deserialize('4k3/8/8/8/B7/8/8/8 b - - 0 1' as FENString))).toBe(true);

    // Not Checkmate (but still in check): Black's king on h8, White's queen on h5, and it's Black's move.
    expect(isCheck(deserialize('7k/8/8/7Q/8/8/8/8 b - - 0 1' as FENString))).toBe(true);

    // Not Checkmate and not in check: Black's king on h8, White's queen on g4, and it's Black's move.
    expect(isCheck(deserialize('7k/8/8/8/6Q1/8/8/8 b - - 0 1' as FENString))).toBe(false);

    // Check: White's king on e1, Black's knight on d3, and it's White's move.
    expect(isCheck(deserialize('8/8/8/8/8/3n4/8/4K3 w - - 0 1' as FENString))).toBe(true);

    // Not Checkmate and not in check: White's king on e1, Black's knight on c3, and it's White's move.
    expect(isCheck(deserialize('8/8/8/8/8/2n5/8/4K3 w - - 0 1' as FENString))).toBe(false);

  });
  it('should report isCheckMate correctly', () => {
    // Starting POS
    expect(isCheckMate(deserialize(StandardStartPositionFEN))).toBe(false);

    // Not Checkmate (but still in check): White's king on e1, Black's rook on e8, Black's bishop on b5, and it's White's move.
    expect(isCheckMate(deserialize('4r3/8/8/1b6/8/8/8/4K3 w - - 0 1' as FENString))).toBe(false);

    // Not Checkmate (but still in check): Black's king on h8, White's queen on h5, and it's Black's move.
    expect(isCheckMate(deserialize('7k/8/8/7Q/8/8/8/8 b - - 0 1' as FENString))).toBe(false);

    // Checkmate: Black's king on e8, White's rooks on a8 and a7, and it's Black's move.
    expect(isCheckMate(deserialize('R3k3/R7/8/8/8/8/8/8 b - - 0 1' as FENString))).toBe(true);

    // Not Checkmate: Black's king on h8, White's queen on h6, and it's Black's move.
    expect(isCheckMate(deserialize('7k/8/7Q/8/8/8/8/8 b - - 0 1' as FENString))).toBe(false);

    // Checkmate: White's king on e1, Black's rooks on d8 and f8, and it's White's move.
    expect(isCheckMate(deserialize('3rr3/8/8/8/8/8/8/4K3 w - - 0 1' as FENString))).toBe(false);
  });
  it('should report isStalemate correctly', () => {
    expect(isStalemate(deserialize(StandardStartPositionFEN))).toBe(false);
    expect(isStalemate(deserialize('8/8/8/8/8/bb6/2b5/K1b5 w - - 0 1' as FENString))).toBe(true);
  });
});
