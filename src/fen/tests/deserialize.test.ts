import {
  describe,
  expect,
  test,
} from '@jest/globals';
import { Board } from '../../board/Board';
import { BoardFile } from '../../board/BoardFile';
import { BoardPosition } from '../../board/BoardPosition';
import { BoardRank } from '../../board/BoardRank';
import {
  NoPiece,
  toChar,
  WhitePawn,
} from '../../piece/ChessPiece';
import { GameState } from '../../state/GameState';
import {
  deserialize,
  parseRank,
} from '../deserializer';
import {
  FENString,
  StandardStartPositionFEN,
} from '../FENString';
import { serialize } from '../serialize';

describe('FEN deserialize', () => {
  test('should parse rank', () => {
    const board = new Board();
    const squares = board.iterate();
    parseRank(toChar(WhitePawn), squares);
    expect(board.getPiece(BoardFile.A, BoardRank.ONE)).toStrictEqual(WhitePawn);
    parseRank(`1${toChar(WhitePawn)}`, squares);
    expect(board.getPiece(BoardFile.B, BoardRank.ONE)).toStrictEqual(NoPiece);
    expect(board.getPiece(BoardFile.C, BoardRank.ONE)).toStrictEqual(WhitePawn);
    {
      const board = new Board();
      const squares = board.iterate();
      parseRank('8', squares);
      parseRank('8', squares);
      parseRank('8', squares);
      parseRank('8', squares);
      parseRank('8', squares);
      parseRank('8', squares);
      parseRank('8', squares);
      parseRank('8', squares);
      expect(() => parseRank('8', squares)).toThrow('Ran out of squares while processing rank string \'8\' at character \'8\': empty 1/8');
    }
  });
  test('deserializes empty state', () => {
    const gameState = deserialize('8/8/8/8/8/8/8/8 w KQkq - 0 1' as FENString);
    expect(gameState).toStrictEqual(new GameState());
  });
  test('deserializes initial state', () => {
    const gameState = deserialize(StandardStartPositionFEN);
    const serialized = serialize(gameState);
    expect(serialized).toBe(StandardStartPositionFEN);
  });
  test('deserializes en-passant', () => {
    const targetSquare = new BoardPosition(BoardFile.A, BoardRank.ONE);
    const enPassantFen = `8/8/8/8/8/8/8/8 w KQkq ${targetSquare} 0 1` as FENString;
    const gameState = deserialize(enPassantFen);
    expect(gameState.enPassantTargetSquare).toStrictEqual(targetSquare);
    const serialized = serialize(gameState);
    expect(serialized).toBe(enPassantFen);
  });

  test('deserializes castling rights', () => {
    const gameState = new GameState();
    expect(deserialize('8/8/8/8/8/8/8/8 w KQkq - 0 1' as FENString)).toStrictEqual(gameState);
    gameState.castlingRights.black.kingSide = false;
    expect(deserialize('8/8/8/8/8/8/8/8 w KQq - 0 1' as FENString)).toStrictEqual(gameState);
    gameState.castlingRights.black.queenSide = false;
    expect(deserialize('8/8/8/8/8/8/8/8 w KQ - 0 1' as FENString)).toStrictEqual(gameState);
    gameState.castlingRights.white.queenSide = false;
    expect(deserialize('8/8/8/8/8/8/8/8 w K - 0 1' as FENString)).toStrictEqual(gameState);
    gameState.castlingRights.white.kingSide = false;
    expect(deserialize('8/8/8/8/8/8/8/8 w - - 0 1' as FENString)).toStrictEqual(gameState);
  });
})
