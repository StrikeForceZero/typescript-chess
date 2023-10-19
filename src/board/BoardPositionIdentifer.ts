import { asSimpleConstEnum } from '../utils/SimpleEnum';
import { BoardFile } from './BoardFile';
import { BoardPosition } from './BoardPosition';
import { BoardRank } from './BoardRank';

// White pieces
export const SquareWhiteQueenSideRook = [BoardFile.A, BoardRank.ONE] as const;
export const SquareWhiteKingSideRook = [BoardFile.H, BoardRank.ONE] as const;
export const SquareWhiteQueenSideKnight = [BoardFile.B, BoardRank.ONE] as const;
export const SquareWhiteKingSideKnight = [BoardFile.G, BoardRank.ONE] as const;
export const SquareWhiteQueenSideBishop = [BoardFile.C, BoardRank.ONE] as const;
export const SquareWhiteKingSideBishop = [BoardFile.F, BoardRank.ONE] as const;
export const SquareWhiteQueen = [BoardFile.D, BoardRank.ONE] as const;
export const SquareWhiteKing = [BoardFile.E, BoardRank.ONE] as const;
export const SquareWhitePawnA = [BoardFile.A, BoardRank.TWO] as const;
export const SquareWhitePawnB = [BoardFile.B, BoardRank.TWO] as const;
export const SquareWhitePawnC = [BoardFile.C, BoardRank.TWO] as const;
export const SquareWhitePawnD = [BoardFile.D, BoardRank.TWO] as const;
export const SquareWhitePawnE = [BoardFile.E, BoardRank.TWO] as const;
export const SquareWhitePawnF = [BoardFile.F, BoardRank.TWO] as const;
export const SquareWhitePawnG = [BoardFile.G, BoardRank.TWO] as const;
export const SquareWhitePawnH = [BoardFile.H, BoardRank.TWO] as const;

// Black pieces
export const SquareBlackQueenSideRook = [BoardFile.A, BoardRank.EIGHT] as const;
export const SquareBlackKingSideRook = [BoardFile.H, BoardRank.EIGHT] as const;
export const SquareBlackQueenSideKnight = [BoardFile.B, BoardRank.EIGHT] as const;
export const SquareBlackKingSideKnight = [BoardFile.G, BoardRank.EIGHT] as const;
export const SquareBlackQueenSideBishop = [BoardFile.C, BoardRank.EIGHT] as const;
export const SquareBlackKingSideBishop = [BoardFile.F, BoardRank.EIGHT] as const;
export const SquareBlackQueen = [BoardFile.D, BoardRank.EIGHT] as const;
export const SquareBlackKing = [BoardFile.E, BoardRank.EIGHT] as const;
export const SquareBlackPawnA = [BoardFile.A, BoardRank.SEVEN] as const;
export const SquareBlackPawnB = [BoardFile.B, BoardRank.SEVEN] as const;
export const SquareBlackPawnC = [BoardFile.C, BoardRank.SEVEN] as const;
export const SquareBlackPawnD = [BoardFile.D, BoardRank.SEVEN] as const;
export const SquareBlackPawnE = [BoardFile.E, BoardRank.SEVEN] as const;
export const SquareBlackPawnF = [BoardFile.F, BoardRank.SEVEN] as const;
export const SquareBlackPawnG = [BoardFile.G, BoardRank.SEVEN] as const;
export const SquareBlackPawnH = [BoardFile.H, BoardRank.SEVEN] as const;

export enum BoardCoord {
  A1 = 'a1',
  A2 = 'a2',
  A3 = 'a3',
  A4 = 'a4',
  A5 = 'a5',
  A6 = 'a6',
  A7 = 'a7',
  A8 = 'a8',

  B1 = 'b1',
  B2 = 'b2',
  B3 = 'b3',
  B4 = 'b4',
  B5 = 'b5',
  B6 = 'b6',
  B7 = 'b7',
  B8 = 'b8',

  C1 = 'c1',
  C2 = 'c2',
  C3 = 'c3',
  C4 = 'c4',
  C5 = 'c5',
  C6 = 'c6',
  C7 = 'c7',
  C8 = 'c8',

  D1 = 'd1',
  D2 = 'd2',
  D3 = 'd3',
  D4 = 'd4',
  D5 = 'd5',
  D6 = 'd6',
  D7 = 'd7',
  D8 = 'd8',

  E1 = 'e1',
  E2 = 'e2',
  E3 = 'e3',
  E4 = 'e4',
  E5 = 'e5',
  E6 = 'e6',
  E7 = 'e7',
  E8 = 'e8',

  F1 = 'f1',
  F2 = 'f2',
  F3 = 'f3',
  F4 = 'f4',
  F5 = 'f5',
  F6 = 'f6',
  F7 = 'f7',
  F8 = 'f8',

  G1 = 'g1',
  G2 = 'g2',
  G3 = 'g3',
  G4 = 'g4',
  G5 = 'g5',
  G6 = 'g6',
  G7 = 'g7',
  G8 = 'g8',

  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  H7 = 'h7',
  H8 = 'h8',
}

export const BoardPos = asSimpleConstEnum({
  A1: BoardPosition.fromString('a1'),
  A2: BoardPosition.fromString('a2'),
  A3: BoardPosition.fromString('a3'),
  A4: BoardPosition.fromString('a4'),
  A5: BoardPosition.fromString('a5'),
  A6: BoardPosition.fromString('a6'),
  A7: BoardPosition.fromString('a7'),
  A8: BoardPosition.fromString('a8'),

  B1: BoardPosition.fromString('b1'),
  B2: BoardPosition.fromString('b2'),
  B3: BoardPosition.fromString('b3'),
  B4: BoardPosition.fromString('b4'),
  B5: BoardPosition.fromString('b5'),
  B6: BoardPosition.fromString('b6'),
  B7: BoardPosition.fromString('b7'),
  B8: BoardPosition.fromString('b8'),

  C1: BoardPosition.fromString('c1'),
  C2: BoardPosition.fromString('c2'),
  C3: BoardPosition.fromString('c3'),
  C4: BoardPosition.fromString('c4'),
  C5: BoardPosition.fromString('c5'),
  C6: BoardPosition.fromString('c6'),
  C7: BoardPosition.fromString('c7'),
  C8: BoardPosition.fromString('c8'),

  D1: BoardPosition.fromString('d1'),
  D2: BoardPosition.fromString('d2'),
  D3: BoardPosition.fromString('d3'),
  D4: BoardPosition.fromString('d4'),
  D5: BoardPosition.fromString('d5'),
  D6: BoardPosition.fromString('d6'),
  D7: BoardPosition.fromString('d7'),
  D8: BoardPosition.fromString('d8'),

  E1: BoardPosition.fromString('e1'),
  E2: BoardPosition.fromString('e2'),
  E3: BoardPosition.fromString('e3'),
  E4: BoardPosition.fromString('e4'),
  E5: BoardPosition.fromString('e5'),
  E6: BoardPosition.fromString('e6'),
  E7: BoardPosition.fromString('e7'),
  E8: BoardPosition.fromString('e8'),

  F1: BoardPosition.fromString('f1'),
  F2: BoardPosition.fromString('f2'),
  F3: BoardPosition.fromString('f3'),
  F4: BoardPosition.fromString('f4'),
  F5: BoardPosition.fromString('f5'),
  F6: BoardPosition.fromString('f6'),
  F7: BoardPosition.fromString('f7'),
  F8: BoardPosition.fromString('f8'),

  G1: BoardPosition.fromString('g1'),
  G2: BoardPosition.fromString('g2'),
  G3: BoardPosition.fromString('g3'),
  G4: BoardPosition.fromString('g4'),
  G5: BoardPosition.fromString('g5'),
  G6: BoardPosition.fromString('g6'),
  G7: BoardPosition.fromString('g7'),
  G8: BoardPosition.fromString('g8'),

  H1: BoardPosition.fromString('h1'),
  H2: BoardPosition.fromString('h2'),
  H3: BoardPosition.fromString('h3'),
  H4: BoardPosition.fromString('h4'),
  H5: BoardPosition.fromString('h5'),
  H6: BoardPosition.fromString('h6'),
  H7: BoardPosition.fromString('h7'),
  H8: BoardPosition.fromString('h8'),
});
