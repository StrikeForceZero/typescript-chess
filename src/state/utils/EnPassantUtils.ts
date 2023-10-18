import { BoardPosition } from '../../board/BoardPosition';
import { boardScanner } from '../../board/utils/BoardScanner';
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
  const scan = boardScanner(gameState.board, gameState.enPassantTargetSquare, targetPieceSearchDirection, true);
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
    // TODO: add limit to boardScanner
    // noinspection LoopStatementThatDoesntLoopJS
    for (const findPotentialAttackerResult of boardScanner(gameState.board, result.pos, direction, true)) {
      if (!ChessPiece.ColoredPiece.is(findPotentialAttackerResult.piece)) break;
      if (findPotentialAttackerResult.piece.coloredPiece.color !== gameState.activeColor) break;
      if (findPotentialAttackerResult.piece.coloredPiece.pieceType !== PieceType.Pawn) break;
      potentialAttackerPositions.push(findPotentialAttackerResult.pos);
      break;
    }
  }
  return {
    capturePos: result.pos,
    attackFromPos: potentialAttackerPositions,
    finalPos: gameState.enPassantTargetSquare,
  };
}
