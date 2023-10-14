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
  NoPiece,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from '../../../piece/ChessPiece';
import { GameState } from '../../../state/GameState';
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
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.TWO]),   piece: WhitePawn });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.THREE]), piece: NoPiece });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.FOUR]),  piece: NoPiece });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.FIVE]),  piece: NoPiece });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.SIX]),   piece: NoPiece });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.SEVEN]), piece: BlackPawn });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.A, BoardRank.EIGHT]), piece: BlackRook });
    expect(scanner.next().done).toBe(true);
  });
  it('should scan east', () => {
    const scanner = boardScanner(gameState.board, new BoardPosition(BoardFile.A, BoardRank.ONE), Direction.East);
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.B, BoardRank.ONE]),   piece: WhiteKnight });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.C, BoardRank.ONE]), piece: WhiteBishop });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.D, BoardRank.ONE]),  piece: WhiteQueen });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.E, BoardRank.ONE]),  piece: WhiteKing });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.F, BoardRank.ONE]),   piece: WhiteBishop });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.G, BoardRank.ONE]), piece: WhiteKnight });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.H, BoardRank.ONE]), piece: WhiteRook });
    expect(scanner.next().done).toBe(true);
  });
  it('should scan north east', () => {
    const scanner = boardScanner(gameState.board, new BoardPosition(BoardFile.A, BoardRank.ONE), Direction.NorthEast);
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.B, BoardRank.TWO]),   piece: WhitePawn });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.C, BoardRank.THREE]), piece: NoPiece });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.D, BoardRank.FOUR]),  piece: NoPiece });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.E, BoardRank.FIVE]),  piece: NoPiece });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.F, BoardRank.SIX]),   piece: NoPiece });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.G, BoardRank.SEVEN]), piece: BlackPawn });
    expect(scanner.next().value).toStrictEqual({ pos: BP.fromTuple([BoardFile.H, BoardRank.EIGHT]), piece: BlackRook });
    expect(scanner.next().done).toBe(true);
  });
  it('should stop on piece', () => {
    const scanner = boardScanner(gameState.board, new BoardPosition(BoardFile.A, BoardRank.ONE), Direction.North, true);
    expect(scanner.next().value.piece).toStrictEqual(WhitePawn); // A2 WhitePawn
    expect(scanner.next().done).toBe(true);
  });
});
