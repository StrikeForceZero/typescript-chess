import { Alge } from 'alge';
import { ChessPieceAsciiChar } from './ChessPieceAsciiChar';
import {
  ColoredPiece,
  from as coloredPieceFrom,
  toChar as coloredPieceToChar,
} from './ColoredPiece';
import { PieceColor } from './PieceColor';
import { PieceType } from './PieceType';

export const ChessPiece = Alge.data('ChessPiece', {
  NoPiece: {},
  ColoredPiece: {
    coloredPiece: ColoredPiece.schema,
  },
});
type ChessPieceInferred = Alge.Infer<typeof ChessPiece>
export type ChessPiece = ChessPieceInferred['*']
export type ChessPieceColored = ChessPieceInferred['ColoredPiece'];

export function isColoredPieceContainer(piece: ChessPiece): piece is ChessPieceColored {
  return ChessPiece.ColoredPiece.is(piece);
}

export function from(piece: ColoredPiece): ChessPieceColored {
  return ChessPiece.ColoredPiece.create({ coloredPiece: piece });
}

export function toChar(piece: ChessPieceColored): ChessPieceAsciiChar {
  return coloredPieceToChar(piece.coloredPiece);
}

export const NoPiece = ChessPiece.NoPiece.create();

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

