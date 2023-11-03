import {
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { deserialize } from '../../../fen/deserializer';
import { StandardStartPositionFEN } from '../../../fen/FENString';
import { Direction } from '../../../move/direction';
import {
  BlackPawn,
  BlackRook,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from '../../../piece/ChessPiece';
import { GameState } from '../../../state/GameState';
import { Option } from '../../../utils/Option';
import { BoardFile } from '../../BoardFile';
import { BoardPosition } from '../../BoardPosition';
import { BoardRank } from '../../BoardRank';
import { boardScanner } from '../BoardScanner';

const BP = BoardPosition;

describe('BoardScanner', () => {
  let gameState: GameState;
  beforeEach(() => {
    gameState = deserialize(StandardStartPositionFEN);
  });
  it('should scan north', () => {
    const scanner = boardScanner(gameState.board, new BoardPosition(BoardFile.A, BoardRank.ONE), Direction.North);
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.TWO]),   piece: Option.Some(WhitePawn) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.THREE]), piece: Option.None() });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.FOUR]),  piece: Option.None() });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.FIVE]),  piece: Option.None() });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.SIX]),   piece: Option.None() });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.SEVEN]), piece: Option.Some(BlackPawn) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.EIGHT]), piece: Option.Some(BlackRook) });
    expect(scanner.next().done).toBe(true);
  });
  it('should scan east', () => {
    const scanner = boardScanner(gameState.board, new BoardPosition(BoardFile.A, BoardRank.ONE), Direction.East);
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.B, BoardRank.ONE]),   piece: Option.Some(WhiteKnight) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.C, BoardRank.ONE]), piece: Option.Some(WhiteBishop) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.D, BoardRank.ONE]),  piece: Option.Some(WhiteQueen) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.E, BoardRank.ONE]),  piece: Option.Some(WhiteKing) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.F, BoardRank.ONE]),   piece: Option.Some(WhiteBishop) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.G, BoardRank.ONE]), piece: Option.Some(WhiteKnight) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.H, BoardRank.ONE]), piece: Option.Some(WhiteRook) });
    expect(scanner.next().done).toBe(true);
  });
  it('should scan north east', () => {
    const scanner = boardScanner(gameState.board, new BoardPosition(BoardFile.A, BoardRank.ONE), Direction.NorthEast);
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.B, BoardRank.TWO]),   piece: Option.Some(WhitePawn) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.C, BoardRank.THREE]), piece: Option.None() });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.D, BoardRank.FOUR]),  piece: Option.None() });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.E, BoardRank.FIVE]),  piece: Option.None() });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.F, BoardRank.SIX]),   piece: Option.None() });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.G, BoardRank.SEVEN]), piece: Option.Some(BlackPawn) });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.H, BoardRank.EIGHT]), piece: Option.Some(BlackRook) });
    expect(scanner.next().done).toBe(true);
  });
  it('should stop on piece', () => {
    const scanner = boardScanner(gameState.board, new BoardPosition(BoardFile.A, BoardRank.ONE), Direction.North, { stopOnPiece: true });
    expect(scanner.next().value?.piece).toStrictEqual(Option.Some(WhitePawn)); // A2 WhitePawn
    expect(scanner.next().done).toBe(true);
  });
});
