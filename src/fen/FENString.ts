import { Opaque } from 'ts-essentials';
import { deserialize } from './deserializer';

export type FENString = Opaque<string, 'FEN'>;

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

export const StandardStartPositionFEN: FENString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' as FENString;
