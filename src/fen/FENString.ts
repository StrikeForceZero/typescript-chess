import { Tagged } from 'type-fest';
import { deserialize } from './deserializer';

export type FENString = Tagged<string, 'FEN'>;

export function looksLikeFen(input: string): input is FENString {
  return /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+ [wb] [KQkq-]{1,4} [a-h1-8-] \d+ [1-9]\d*$/.test(input);
}

export function assertIsFen(input: string): asserts input is FENString {
  if (!looksLikeFen(input)) {
    throw new Error(`'${input}' does not look like a fen string!`);
  }
  deserialize(input);
}

export function isFen(input: string): input is FENString {
  try {
    assertIsFen(input);
  } catch (err) {
    return false;
  }
  return true;
}

export function getParts(
  fenString: FENString,
): readonly [
  boardString: string,
  activeColorString: string,
  castleRightsString: string,
  enPassantTargetSquareString: string,
  halfMoveClock: number,
  fullMoveClock: number,
] {
  const parts = fenString.split(' ');

  if (parts.length !== 6) {
    throw new Error('invalid FEN');
  }

  const [
    boardString,
    activeColorString,
    castleRightsString,
    enPassantTargetSquareString,
    halfMoveClockString,
    fullMoveClockString,
  ] = parts;

  if (
    !boardString
    || !activeColorString
    || !castleRightsString
    || !enPassantTargetSquareString
    || !halfMoveClockString
    || !fullMoveClockString
  ) {
    throw new Error('Invalid FEN');
  }

  return [
    boardString,
    activeColorString,
    castleRightsString,
    enPassantTargetSquareString,
    Number(halfMoveClockString),
    Number(fullMoveClockString),
  ] as const;
}

export type FENStringBoardOnly = Tagged<string, 'FEN_BOARD'>;

export const EmptyBoardOnlyFEN: FENStringBoardOnly = '8/8/8/8/8/8/8/8' as FENStringBoardOnly;
export const StandardStartPositionBoardOnlyFEN: FENStringBoardOnly = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' as FENStringBoardOnly;
export const StandardStartPositionFEN: FENString = `${StandardStartPositionBoardOnlyFEN} w KQkq - 0 1` as FENString;
