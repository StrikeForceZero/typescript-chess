import { Board } from '../../board/Board';
import { BoardPosition } from '../../board/BoardPosition';
import { BoardRank } from '../../board/BoardRank';
import { boardScanner } from '../../board/utils/BoardScanner';
import { isPieceAtStartingPos } from '../../board/utils/BoardUtils';
import { Direction } from '../../move/direction';
import { ChessPiece } from '../../piece/ChessPiece';
import { PieceColor } from '../../piece/PieceColor';
import { PieceType } from '../../piece/PieceType';
import { GameState } from '../GameState';

const ActiveColorToSearchDirectionMap = {
  [PieceColor.White]: Direction.South,
  [PieceColor.Black]: Direction.North,
} as const satisfies Record<PieceColor, Direction.South | Direction.North>;

type EnPassantCaptureData = {
  readonly capturePos: BoardPosition,
  readonly attackFromPos: BoardPosition[],
  readonly finalPos: BoardPosition,
};

export function getEnPassantCaptureData(gameState: GameState): EnPassantCaptureData | undefined {
  if (!gameState.enPassantTargetSquare) {
    return;
  }
  const targetPieceSearchDirection = ActiveColorToSearchDirectionMap[gameState.activeColor];
  const scan = boardScanner(gameState.board, gameState.enPassantTargetSquare, targetPieceSearchDirection, { stopOnPiece: true });
  const next = scan.next();
  if (next.done || !next.value) {
    throw new Error('bad en passant state?');
  }
  const result = next.value;
  const targetPiece = result.piece;
  if (!ChessPiece.ColoredPiece.is(targetPiece)) {
    throw new Error('bad en passant state?');
  }
  const potentialAttackerPositions: BoardPosition[] = [];
  for (const direction of [Direction.West, Direction.East]) {
    const findPotentialAttackerResult = boardScanner(gameState.board, result.pos, direction, { stopOnPiece: true, limit: 1 }).next().value;

    if (findPotentialAttackerResult) {
      const { piece, pos } = findPotentialAttackerResult;
      if (
        // ensure there is a piece
        ChessPiece.ColoredPiece.is(piece) &&
        // the piece is active color
        piece.coloredPiece.color === gameState.activeColor &&
        // and the attacking piece is a pawn
        piece.coloredPiece.pieceType === PieceType.Pawn
      ) {
        potentialAttackerPositions.push(pos);
      }
    }

  }
  return {
    capturePos: result.pos,
    attackFromPos: potentialAttackerPositions,
    finalPos: gameState.enPassantTargetSquare,
  };
}

export function getEnPassantSquareFromMove(board: Board, fromPos: BoardPosition, toPos: BoardPosition): BoardPosition | null {
  const movingPiece = board.getPieceFromPos(fromPos);
  if (!ChessPiece.ColoredPiece.is(movingPiece) || movingPiece.coloredPiece.pieceType !== PieceType.Pawn) {
    return null;
  }
  if (isPieceAtStartingPos(board, fromPos)) {
    return null;
  }
  const difference = fromPos.rank - toPos.rank;
  // en passant only valid on double move
  if (Math.abs(difference) !== 2) {
    return null;
  }
  // TODO: with all the pure functions this feels weird but technically should be valid
  //  at least extract to function and test?
  // move up/down by one to get en passant square
  const targetRank: BoardRank = fromPos.rank + Math.sign(difference) as BoardRank;
  return BoardPosition.fromTuple([fromPos.file, targetRank]);
}
