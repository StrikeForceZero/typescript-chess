import { Board } from '../../board/Board';
import { BoardPosition } from '../../board/BoardPosition';
import {
  SquareBlackKing,
  SquareBlackKingSideRook,
  SquareBlackQueenSideRook,
  SquareWhiteKing,
  SquareWhiteKingSideRook,
  SquareWhiteQueenSideRook,
} from '../../board/BoardPositionIdentifer';
import { isPieceAtStartingPos } from '../../board/utils/BoardUtils';
import { CastlingRights } from '../CastlingRights';

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
