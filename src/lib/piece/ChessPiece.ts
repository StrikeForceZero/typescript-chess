import { ColoredPiece } from './ColoredPiece';

export enum Kind {
  None,
  Piece,
}

export const NoPiece = { kind: Kind.None };
export type NoPiece = typeof NoPiece;

export type ColoredPieceContainer = {
  kind: Kind.Piece,
  piece: ColoredPiece,
}

export type ChessPiece = NoPiece | ColoredPieceContainer;

export function isColoredPieceContainer(piece: ChessPiece): piece is ColoredPieceContainer {
  return piece.kind === Kind.Piece;
}

export function from(piece: ColoredPiece): ColoredPieceContainer {
  return {
    kind: Kind.Piece,
    piece,
  };
}
