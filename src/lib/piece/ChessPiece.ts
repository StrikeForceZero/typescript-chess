import {
  ColoredPiece,
  from as coloredPieceFrom,
  toChar as coloredPieceToChar,
} from './ColoredPiece';
import { PieceColor } from './PieceColor';
import { PieceType } from './PieceType';

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

export function toChar(piece: ColoredPieceContainer): string {
  return coloredPieceToChar(piece.piece);
}

export const WhitePawn = from(coloredPieceFrom(PieceColor.White, PieceType.Pawn));
export const WhiteKnight = from(coloredPieceFrom(PieceColor.White, PieceType.Knight));
export const WhiteBishop = from(coloredPieceFrom(PieceColor.White, PieceType.Bishop));
export const WhiteRook = from(coloredPieceFrom(PieceColor.White, PieceType.Rook));
export const WhiteQueen = from(coloredPieceFrom(PieceColor.White, PieceType.Queen));
export const WhiteKing = from(coloredPieceFrom(PieceColor.White, PieceType.King));

export const BlackPawn = from(coloredPieceFrom(PieceColor.Black, PieceType.Pawn));
export const BlackKnight = from(coloredPieceFrom(PieceColor.Black, PieceType.Knight));
export const BlackBishop = from(coloredPieceFrom(PieceColor.Black, PieceType.Bishop));
export const BlackRook = from(coloredPieceFrom(PieceColor.Black, PieceType.Rook));
export const BlackQueen = from(coloredPieceFrom(PieceColor.Black, PieceType.Queen));
export const BlackKing = from(coloredPieceFrom(PieceColor.Black, PieceType.King));

