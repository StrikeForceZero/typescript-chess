import { ExecutableMove } from '../move/ExecutableMove';
import { MoveResult } from '../move/move';
import { resolveMoves } from '../move/PieceMoveMap';
import { isColoredPieceContainer } from '../piece/ChessPiece';
import { PieceType } from '../piece/PieceType';
import { getRandomItem } from '../utils/array';
import { assertIsNotEmpty } from '../utils/assert';
import { PromotionRequiredError } from '../utils/errors/PromotionRequiredError';
import { Result } from '../utils/Result';
import { AbstractBot } from './AbstractBot';

export class RandomBot extends AbstractBot {
  public handleTurn(): Result<MoveResult, unknown> {
    try {
      const validMoves: ExecutableMove[] = [];
      for (const square of this.game.gameState.board) {
        if (!isColoredPieceContainer(square.piece)) continue;
        if (square.piece.coloredPiece.color !== this.playAsColor) continue;
        const moves = resolveMoves(square.piece.coloredPiece.pieceType, square.piece.coloredPiece.color);
        for (const move of moves) {
          validMoves.push(...move.getValidMovesForPosition(this.game.gameState, square.pos));
        }
      }
      assertIsNotEmpty(validMoves, 'no valid moves for bot!');
      const randomMove = getRandomItem(validMoves);
      let moveResult = Result.capture(() => this.game.move(randomMove.fromPos, randomMove.toPos));
      if (moveResult.isErr()) {
        const error = moveResult.unwrapErr();
        if (error instanceof PromotionRequiredError) {
          const pieceTypes = Object.values(PieceType);
          assertIsNotEmpty(pieceTypes, 'impossible: Object.values(PieceType) was empty!');
          const randomPromotion = getRandomItem(pieceTypes);
          moveResult = Result.capture(() => this.game.move(randomMove.fromPos, randomMove.toPos, randomPromotion));
        }
        return Result.Err(moveResult.unwrapErr());
      }
      return moveResult.unwrap();
    }
    // TODO: maybe make Result.capture flatten the result instead of being forced to use a try catch
    catch (err) {
      return Result.Err(err);
    }
  }
}
