import { Alge } from 'alge';
import { match } from 'ts-pattern';
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

function _create(piece: ColoredPiece): ChessPieceColored {
  return ChessPiece.ColoredPiece.create({ coloredPiece: piece });
}

export function isColoredPieceContainer(piece: ChessPiece): piece is ChessPieceColored {
  return ChessPiece.ColoredPiece.is(piece);
}

export function from(color: PieceColor, pieceType: PieceType): ChessPieceColored {
  return match([color, pieceType])
    .with([PieceColor.White, PieceType.Pawn], _ => WhitePawn)
    .with([PieceColor.White, PieceType.Knight], _ => WhiteKnight)
    .with([PieceColor.White, PieceType.Bishop], _ => WhiteBishop)
    .with([PieceColor.White, PieceType.Rook], _ => WhiteRook)
    .with([PieceColor.White, PieceType.Queen], _ => WhiteQueen)
    .with([PieceColor.White, PieceType.King], _ => WhiteKing)
    .with([PieceColor.Black, PieceType.Pawn], _ => BlackPawn)
    .with([PieceColor.Black, PieceType.Knight], _ => BlackKnight)
    .with([PieceColor.Black, PieceType.Bishop], _ => BlackBishop)
    .with([PieceColor.Black, PieceType.Rook], _ => BlackRook)
    .with([PieceColor.Black, PieceType.Queen], _ => BlackQueen)
    .with([PieceColor.Black, PieceType.King], _ => BlackKing)
    .exhaustive();
}

export function fromColoredPiece(coloredPiece: ColoredPiece): ChessPieceColored {
  return from(coloredPiece.color, coloredPiece.pieceType);
}

export function toChar(piece: ChessPieceColored): ChessPieceAsciiChar {
  return coloredPieceToChar(piece.coloredPiece);
}

// fixes references for faster comparisons
// should only be used in deserialization
export function fixReference(chessPiece: ChessPiece): ChessPiece {
  return match(chessPiece)
    .with(NoPiece, _ => NoPiece)
    .with({ coloredPiece: { color: PieceColor.White, pieceType: PieceType.Pawn} }, _ => WhitePawn)
    .with({ coloredPiece: { color: PieceColor.White, pieceType: PieceType.Knight} }, _ => WhiteKnight)
    .with({ coloredPiece: { color: PieceColor.White, pieceType: PieceType.Bishop} }, _ => WhiteBishop)
    .with({ coloredPiece: { color: PieceColor.White, pieceType: PieceType.Rook} }, _ => WhiteRook)
    .with({ coloredPiece: { color: PieceColor.White, pieceType: PieceType.Queen} }, _ => WhiteQueen)
    .with({ coloredPiece: { color: PieceColor.White, pieceType: PieceType.King} }, _ => WhiteKing)
    .with({ coloredPiece: { color: PieceColor.Black, pieceType: PieceType.Pawn} }, _ => BlackPawn)
    .with({ coloredPiece: { color: PieceColor.Black, pieceType: PieceType.Knight} }, _ => BlackKnight)
    .with({ coloredPiece: { color: PieceColor.Black, pieceType: PieceType.Bishop} }, _ => BlackBishop)
    .with({ coloredPiece: { color: PieceColor.Black, pieceType: PieceType.Rook} }, _ => BlackRook)
    .with({ coloredPiece: { color: PieceColor.Black, pieceType: PieceType.Queen} }, _ => BlackQueen)
    .with({ coloredPiece: { color: PieceColor.Black, pieceType: PieceType.King} }, _ => BlackKing)
    .exhaustive();
}

export const NoPiece = ChessPiece.NoPiece.create();

export const WhitePawn = _create(coloredPieceFrom(PieceColor.White, PieceType.Pawn));
export const WhiteKnight = _create(coloredPieceFrom(PieceColor.White, PieceType.Knight));
export const WhiteBishop = _create(coloredPieceFrom(PieceColor.White, PieceType.Bishop));
export const WhiteRook = _create(coloredPieceFrom(PieceColor.White, PieceType.Rook));
export const WhiteQueen = _create(coloredPieceFrom(PieceColor.White, PieceType.Queen));
export const WhiteKing = _create(coloredPieceFrom(PieceColor.White, PieceType.King));

export const BlackPawn = _create(coloredPieceFrom(PieceColor.Black, PieceType.Pawn));
export const BlackKnight = _create(coloredPieceFrom(PieceColor.Black, PieceType.Knight));
export const BlackBishop = _create(coloredPieceFrom(PieceColor.Black, PieceType.Bishop));
export const BlackRook = _create(coloredPieceFrom(PieceColor.Black, PieceType.Rook));
export const BlackQueen = _create(coloredPieceFrom(PieceColor.Black, PieceType.Queen));
export const BlackKing = _create(coloredPieceFrom(PieceColor.Black, PieceType.King));
