import { Board } from '../../board/Board';
import { BoardPosition } from '../../board/BoardPosition';
import { BoardRank } from '../../board/BoardRank';
import { boardScanner } from '../../board/utils/BoardScanner';
import { isPieceAtStartingPos } from '../../board/utils/BoardUtils';
import { Direction } from '../../move/direction';
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

export function getEnPassantCaptureData(gameState: GameState, attackingColor: PieceColor = gameState.activeColor): EnPassantCaptureData | undefined {
  if (!gameState.enPassantTargetSquare) {
    return;
  }
  const targetPieceSearchDirection = ActiveColorToSearchDirectionMap[attackingColor];
  const scan = boardScanner(gameState.board, gameState.enPassantTargetSquare, targetPieceSearchDirection, { stopOnPiece: true });
  const next = scan.next();
  if (next.done || !next.value) {
    throw new Error('bad en passant state?');
  }
  const result = next.value;
  const targetPiece = result.piece;
  if (!targetPiece.isSome()) {
    if (gameState.activeColor !== attackingColor) {
      // if the attacking color doesn't match the active color we don't throw because it could be a test move
      // TODO: maybe test moves should change the active color?
      return;
    }
    throw new Error('bad en passant state?');
  }
  const potentialAttackerPositions: BoardPosition[] = [];
  for (const direction of [Direction.West, Direction.East]) {
    const findPotentialAttackerResult = boardScanner(gameState.board, result.pos, direction, { stopOnPiece: true, limit: 1 }).next().value;

    if (findPotentialAttackerResult) {
      const { piece, pos } = findPotentialAttackerResult;
      if (
        // ensure there is a piece
        piece.isSome() &&
        // the piece is active color
        piece.value.color === attackingColor &&
        // and the attacking piece is a pawn
        piece.value.pieceType === PieceType.Pawn
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
  if (!movingPiece.isSome() || movingPiece.value.pieceType !== PieceType.Pawn) {
    return null;
  }
  if (!isPieceAtStartingPos(board, fromPos)) {
    return null;
  }
  const difference = toPos.rank - fromPos.rank;
  // en passant only valid on double move
  if (Math.abs(difference) !== 2) {
    return null;
  }
  // TODO: with all the pure functions this feels weird but technically should be valid
  // move up/down by one to get en passant square
  const targetRank: BoardRank = fromPos.rank + Math.sign(difference) as BoardRank;
  return BoardPosition.fromTuple([fromPos.file, targetRank]);
}
