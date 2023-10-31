import { Game } from '../game/Game';
import { ExecutableMove } from '../move/ExecutableMove';
import { MoveResult } from '../move/move';
import { resolveMoves } from '../move/PieceMoveMap';
import { isColoredPieceContainer } from '../piece/ChessPiece';
import { PieceType } from '../piece/PieceType';
import {
  getRandomItem,
  NotEmptyArray,
} from '../utils/array';
import { assertIsNotEmpty } from '../utils/assert';
import { InvalidMoveError } from '../utils/errors/InvalidMoveError';
import { PromotionRequiredError } from '../utils/errors/PromotionRequiredError';
import { Result } from '../utils/Result';
import { AbstractBot } from './AbstractBot';

export class RandomBot extends AbstractBot {
  private executeMove(game: Game, move: ExecutableMove): Result<MoveResult, unknown> {
    try {
      let moveResult = game.move(move.fromPos, move.toPos);
      if (moveResult.isErr()) {
        const error = moveResult.unwrapErr();
        if (error instanceof PromotionRequiredError) {
          // TODO: add this list as a valid promotion piece list for others to use as well
          const pieceTypes = Object.values(PieceType).filter(p => p !== PieceType.Pawn && p !== PieceType.King);
          assertIsNotEmpty(pieceTypes, 'impossible: Object.values(PieceType) was empty!');
          const randomPromotion = getRandomItem(pieceTypes);
          moveResult = game.move(move.fromPos, move.toPos, randomPromotion);
        }
      }
      return moveResult;
    }
    catch (err) {
      return Result.Err(err);
    }
  }
  private executeRandomMove(game: Game, validMoves: NotEmptyArray<ExecutableMove>): Result<MoveResult, unknown> {
    let randomMove: ExecutableMove | null = null;
    let randomMoveResult: Result<MoveResult, unknown> | null = null;
    do {
      if (randomMove) {
        validMoves.splice(validMoves.indexOf(randomMove), 1);
      }
      if (validMoves.length === 0) {
        console.error('no more random moves available to try!');
        break;
      }
      randomMove = getRandomItem(validMoves);
      randomMoveResult = this.executeMove(game, randomMove);
    } while (randomMoveResult.isErr() && validMoves.length > 0);
    if (!randomMoveResult || randomMoveResult.isErr()) {
      return Result.Err(new InvalidMoveError('no valid moves'));
    }
    return randomMoveResult;
  }
  public handleTurn(game: Game): Result<MoveResult, unknown> {
    try {
      const validMoves: ExecutableMove[] = [];
      for (const square of game.gameState.board) {
        if (!isColoredPieceContainer(square.piece)) continue;
        if (square.piece.coloredPiece.color !== this.playAsColor) continue;
        const moves = resolveMoves(square.piece.coloredPiece.pieceType, square.piece.coloredPiece.color);
        for (const move of moves) {
          validMoves.push(...move.getValidMovesForPosition(game.gameState, square.pos));
        }
      }
      assertIsNotEmpty(validMoves, 'no valid moves for bot!');
      return this.executeRandomMove(game, validMoves);
    }
    // TODO: maybe make Result.capture flatten the result instead of being forced to use a try catch
    catch (err) {
      return Result.Err(err);
    }
  }
}
