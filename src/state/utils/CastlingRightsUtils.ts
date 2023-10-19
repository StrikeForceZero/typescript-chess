import { Board } from '../../board/Board';
import { BoardFile } from '../../board/BoardFile';
import { BoardPosition } from '../../board/BoardPosition';
import {
  SquareBlackKing,
  SquareBlackKingSideRook,
  SquareBlackQueenSideRook,
  SquareWhiteKing,
  SquareWhiteKingSideRook,
  SquareWhiteQueenSideRook,
} from '../../board/BoardPositionIdentifer';
import { BoardRank } from '../../board/BoardRank';
import { CastleSide } from '../../board/CastleSide';
import { boardScanner } from '../../board/utils/BoardScanner';
import { isPieceAtStartingPos } from '../../board/utils/BoardUtils';
import { Direction } from '../../move/direction';
import { ChessPiece } from '../../piece/ChessPiece';
import { PieceColor } from '../../piece/PieceColor';
import { PieceType } from '../../piece/PieceType';
import { assertExhaustive } from '../../utils/assert';
import { CastlingRights } from '../CastlingRights';
import { CastlingRightsForColor } from '../CastlingRightsForColor';

export function loadInitialCastleRightsFromBoard(board: Board): CastlingRights {
  const castleRights = new CastlingRights();

  const isWhiteKingAtStart = isPieceAtStartingPos(board, BoardPosition.fromTuple(SquareWhiteKing));
  castleRights.white.queenSide = isWhiteKingAtStart && isPieceAtStartingPos(board, BoardPosition.fromTuple(SquareWhiteQueenSideRook));
  castleRights.white.kingSide = isWhiteKingAtStart && isPieceAtStartingPos(board, BoardPosition.fromTuple(SquareWhiteKingSideRook));

  const isBlackKingAtStart = isPieceAtStartingPos(board, BoardPosition.fromTuple(SquareBlackKing));
  castleRights.black.queenSide = isBlackKingAtStart && isPieceAtStartingPos(board, BoardPosition.fromTuple(SquareBlackQueenSideRook));
  castleRights.black.kingSide = isBlackKingAtStart && isPieceAtStartingPos(board, BoardPosition.fromTuple(SquareBlackKingSideRook));

  return castleRights;
}

export function updateCastleRights(board: Board, castleRights: CastlingRights): void {
  const initialCastleRights = loadInitialCastleRightsFromBoard(board);
  castleRights.white.kingSide = castleRights.white.kingSide && initialCastleRights.white.kingSide;
  castleRights.white.queenSide = castleRights.white.queenSide && initialCastleRights.white.queenSide;
  castleRights.black.kingSide = castleRights.black.kingSide && initialCastleRights.black.kingSide;
  castleRights.black.queenSide = castleRights.black.queenSide && initialCastleRights.black.queenSide;
}

const DirectionCastleSideMap = {
  [CastleSide.QueenSide]: Direction.West,
  [CastleSide.KingSide]: Direction.East,
} as const satisfies Record<CastleSide, Direction.West | Direction.East>;

const CastleSideToDirectionMap = {
  [Direction.West]: CastleSide.QueenSide,
  [Direction.East]: CastleSide.KingSide,
} as const satisfies Record<Direction.West | Direction.East, CastleSide>;

export function getCastleSideFromDirection(direction: Direction): CastleSide | undefined {
  return CastleSideToDirectionMap[direction as keyof typeof CastleSideToDirectionMap];
}

export function getCastleRightsForColor(castleRights: CastlingRights, color: PieceColor): CastlingRightsForColor {
  switch (color) {
    case PieceColor.White: return castleRights.white;
    case PieceColor.Black: return castleRights.black;
    default: return assertExhaustive(color);
  }
}

type ValidCastleSideResults =
  []
  | [CastleSide]
  | [CastleSide.QueenSide, CastleSide.KingSide];

export function getValidCastleSides(board: Board, castleRights: CastlingRights, sourcePos: BoardPosition): ValidCastleSideResults {
  const maybeKing = board.getPieceFromPos(sourcePos);
  if (!ChessPiece.ColoredPiece.is(maybeKing) || maybeKing.coloredPiece.pieceType !== PieceType.King) {
    // not king
    return [];
  }
  const king = maybeKing;
  // king not at starting position
  if (!isPieceAtStartingPos(board, sourcePos)) {
    return [];
  }
  const color = king.coloredPiece.color;
  const castleRightsForColor = getCastleRightsForColor(castleRights, color);
  const canCastleSides: CastleSide[] = [];
  for (const side of Object.values(CastleSide)) {
    if (!castleRightsForColor.get(side)) continue;
    for (const result of boardScanner(board, sourcePos, DirectionCastleSideMap[side], true)) {
      // empty square continue
      if (!ChessPiece.ColoredPiece.is(result.piece)) continue;
      // not same color, cant castle on this side
      if (result.piece.coloredPiece.color !== color) break;
      // not rook or rook is not in starting pos, cant castle on this side
      if (result.piece.coloredPiece.pieceType !== PieceType.Rook || !isPieceAtStartingPos(board, result.pos)) break;
      canCastleSides.push(side);
      break;
    }
  }
  return canCastleSides as ValidCastleSideResults;
}

const CastleSideRookFileMap = {
  [CastleSide.QueenSide]: BoardFile.A,
  [CastleSide.KingSide]: BoardFile.H,
} as const satisfies Record<CastleSide, typeof BoardFile.A | typeof BoardFile.H>;

const CastleSideRookTargetFileMap = {
  [CastleSide.QueenSide]: BoardFile.D,
  [CastleSide.KingSide]: BoardFile.F,
} as const satisfies Record<CastleSide, typeof BoardFile.D | typeof BoardFile.F>;

const TargetKingFileToCastleSideMap = {
  [BoardFile.C]: CastleSide.QueenSide,
  [BoardFile.G]: CastleSide.KingSide,
} as const satisfies Record<typeof BoardFile.C | typeof BoardFile.G, CastleSide>;

const CastleSideToTargetKingFileMap = {
  [CastleSide.QueenSide]: BoardFile.C,
  [CastleSide.KingSide]: BoardFile.G,
} as const satisfies Record<CastleSide, typeof BoardFile.C | typeof BoardFile.G>;

// TODO: this might belong somewhere else?
const ColorToBacklineRankMap = {
  [PieceColor.White]: BoardRank.ONE,
  [PieceColor.Black]: BoardRank.EIGHT,
} as const satisfies Record<PieceColor, typeof BoardRank.ONE | typeof BoardRank.EIGHT>;

export function mapCastleSideToTargetPosition(castleSide: CastleSide, sourcePos: BoardPosition): BoardPosition {
  return BoardPosition.fromTuple([CastleSideToTargetKingFileMap[castleSide], sourcePos.rank]);
}

export function performCastle(board: Board, sourcePos: BoardPosition, targetPos: BoardPosition): void {
  const maybeKing = board.getPieceFromPos(sourcePos);
  if (!ChessPiece.ColoredPiece.is(maybeKing) || maybeKing.coloredPiece.pieceType !== PieceType.King) {
    // not king
    throw new Error('not king!');
  }
  const king = maybeKing;
  // king not at starting position
  if (!isPieceAtStartingPos(board, sourcePos)) {
    throw new Error('king not at starting position');
  }
  const color = king.coloredPiece.color;
  const rank = ColorToBacklineRankMap[color];
  if (targetPos.rank !== rank) {
    throw new Error('invalid target position for castle');
  }
  const side = TargetKingFileToCastleSideMap[targetPos.file];
  if (!side) {
    throw new Error('invalid target position for castle');
  }
  if (!getCastleRightsForColor(loadInitialCastleRightsFromBoard(board), color).get(side)) {
    throw new Error('not in a position to castle');
  }
  const rookSourcePos: [BoardFile, BoardRank] = [CastleSideRookFileMap[side], rank];
  const rookTargetPos: [BoardFile, BoardRank] = [CastleSideRookTargetFileMap[side], rank];
  board.removePieceFromPos(sourcePos);
  board.placePieceFromPos(king, targetPos);
  const rook = board.removePiece(...rookSourcePos);
  board.placePiece(rook, ...rookTargetPos);
}
