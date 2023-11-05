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
  toChar,
  WhitePawn,
} from '../../piece/ChessPiece';
import { GameState } from '../../state/GameState';
import { Option } from '../../utils/Option';
import {
  deserialize,
  deserializeBoardOnlyFENString,
  parseRank,
} from '../deserializer';
import {
  EmptyBoardOnlyFEN,
  FENString,
  FENStringBoardOnly,
  StandardStartPositionBoardOnlyFEN,
  StandardStartPositionFEN,
} from '../FENString';
import { serialize } from '../serialize';

describe('FEN deserialize', () => {
  test('should parse rank', () => {
    const board = new Board();
    const squares = board.iterate();
    parseRank(toChar(WhitePawn), squares);
    expect(board.getPiece(BoardFile.A, BoardRank.ONE)).toStrictEqual(Option.Some(WhitePawn));
    parseRank(`1${toChar(WhitePawn)}`, squares);
    expect(board.getPiece(BoardFile.B, BoardRank.ONE)).toStrictEqual(Option.None());
    expect(board.getPiece(BoardFile.C, BoardRank.ONE)).toStrictEqual(Option.Some(WhitePawn));
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
    const expectedGameState = Object.assign(
      new GameState(), {
        history: Object.assign(
          new GameState().history,
          {
            pgn: [],
            fen: ['8/8/8/8/8/8/8/8 w KQkq - 0 1'],
          },
        ),
      },
    );
    expect(gameState).toStrictEqual(expectedGameState);
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
    expect(deserialize('8/8/8/8/8/8/8/8 w KQkq - 0 1' as FENString).castlingRights).toStrictEqual(gameState.castlingRights);
    gameState.castlingRights.black.kingSide = false;
    expect(deserialize('8/8/8/8/8/8/8/8 w KQq - 0 1' as FENString).castlingRights).toStrictEqual(gameState.castlingRights);
    gameState.castlingRights.black.queenSide = false;
    expect(deserialize('8/8/8/8/8/8/8/8 w KQ - 0 1' as FENString).castlingRights).toStrictEqual(gameState.castlingRights);
    gameState.castlingRights.white.queenSide = false;
    expect(deserialize('8/8/8/8/8/8/8/8 w K - 0 1' as FENString).castlingRights).toStrictEqual(gameState.castlingRights);
    gameState.castlingRights.white.kingSide = false;
    expect(deserialize('8/8/8/8/8/8/8/8 w - - 0 1' as FENString).castlingRights).toStrictEqual(gameState.castlingRights);
  });

  test('deserializes just board', () => {
    expect(deserializeBoardOnlyFENString(StandardStartPositionBoardOnlyFEN)).toStrictEqual(deserialize(StandardStartPositionFEN).board);
    expect(deserializeBoardOnlyFENString(EmptyBoardOnlyFEN)).toStrictEqual(new Board());
    expect(deserializeBoardOnlyFENString('8' as FENStringBoardOnly)).toStrictEqual(new Board());
    expect(deserializeBoardOnlyFENString('' as FENStringBoardOnly)).toStrictEqual(new Board());
  });
});
