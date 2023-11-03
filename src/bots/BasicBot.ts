import { Game } from '../game/Game';
import { ExecutableMove } from '../move/ExecutableMove';
import { MoveResult } from '../move/move';
import { performMove } from '../move/performMove';
import { resolveMoves } from '../move/PieceMoveMap';
import { ChessPiece } from '../piece/ChessPiece';
import { PieceType } from '../piece/PieceType';
import {
  isCheck,
  isCheckMate,
} from '../state/utils/CheckUtils';
import { Result } from '../utils/Result';
import { AbstractBot } from './AbstractBot';
import { RandomBot } from './RandomBot';

type PotentialAttack = {
  isCheck: boolean,
  isCheckMate: boolean,
  ourMove: boolean,
  move: ExecutableMove,
  capturedPiece: ChessPiece,
}

const PieceValueMap = {
  [PieceType.Pawn]: 1,
  [PieceType.Rook]: 3,
  [PieceType.Knight]: 2,
  [PieceType.Bishop]: 2,
  [PieceType.Queen]: 4,
  [PieceType.King]: 5,
} as const;

function potentialAttackSort(a: PotentialAttack, b: PotentialAttack): number {
  if (a.isCheckMate > b.isCheckMate) return 1;
  if (a.isCheckMate < b.isCheckMate) return -1;
  if (a.isCheck > b.isCheck) return 1;
  if (a.isCheck < b.isCheck) return -1;
  if (PieceValueMap[a.capturedPiece.pieceType] < PieceValueMap[b.capturedPiece.pieceType]) return -1;
  if (PieceValueMap[a.capturedPiece.pieceType] === PieceValueMap[b.capturedPiece.pieceType]) return -0;
  if (PieceValueMap[a.capturedPiece.pieceType] > PieceValueMap[b.capturedPiece.pieceType]) return 1;
  throw new Error('impossible');
}

export class BasicBot extends AbstractBot {
  public override handleTurn(game: Game): Result<MoveResult, unknown> {
    const potentialTargets: PotentialAttack[] = [];
    for(const square of game.gameState.board) {
      if (!square.piece.isSome()) continue;
      const moves = resolveMoves(square.piece.value.pieceType, square.piece.value.color);
      const validMoves = moves.flatMap(move => move.getValidMovesForPosition(game.gameState, square.pos));
      for (const move of validMoves) {
        const gameStateClone = game.gameState.clone();
        const result = move.tryExec(gameStateClone, performMove);
        if (result.isOk()) {
          const capturedPiece = result.unwrap();
          if (capturedPiece.isSome()) {
            potentialTargets.push({
              move,
              isCheck: isCheck(gameStateClone, true),
              isCheckMate: isCheckMate(gameStateClone, true),
              ourMove: capturedPiece.value.color !== this.playAsColor,
              capturedPiece: capturedPiece.value,
            });
          }
        }
      }
    }
    potentialTargets.sort(potentialAttackSort).reverse();
    for (const potentialTarget of potentialTargets) {
      // TODO: handle avoiding attacks
      if (!potentialTarget.ourMove) continue;
      return game.move(potentialTarget.move.fromPos, potentialTarget.move.toPos, PieceType.Queen);
    }

    return RandomBot.handleTurn(game, this.playAsColor);
  }
}
