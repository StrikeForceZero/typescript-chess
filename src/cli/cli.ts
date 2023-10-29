import { BoardPosition } from '../board/BoardPosition';
import { serialize } from '../fen/serialize';
import { Game } from '../game/Game';
import { MoveResult } from '../move/move';
import { isColoredPieceContainer } from '../piece/ChessPiece';
import { fromChar } from '../piece/ColoredPiece';
import {
  PieceType,
  toChar,
} from '../piece/PieceType';
import { isGameOver } from '../state/utils/GameStatusUtils';
import { isChar } from '../utils/char';
import { PromotionRequiredError } from '../utils/errors/PromotionRequiredError';
import { printBoardToUnicode } from '../utils/print/unicode';
import { createInterface } from 'node:readline';
import { Result } from '../utils/Result';

if (require.main !== module) {
  throw new Error('This module is intended to be run as a standalone script and not imported elsewhere. Please run it directly.');
}

function parseMoveInput(input: string): Result<[fromPos: BoardPosition, toPos: BoardPosition], unknown> {
  const [fromStr, toStr, ...extra] = input.split(' ');
  if (extra.length || !fromStr || fromStr.length !== 2 || !toStr || toStr.length !== 2) {
    return Result.Err(new Error(`Invalid move format: expected: <a-g><1-8> <a-g><1-8>, got: '${input}'`));
  }
  try {
    return Result.Ok([BoardPosition.fromString(fromStr), BoardPosition.fromString(toStr)]);
  } catch (err) {
    return Result.Err(err);
  }
}

async function main() {
  const game = new Game();
  const prompt = createInterface({ input: process.stdin, output: process.stdout });

  async function promptForPromotion(fromPos: BoardPosition, toPos: BoardPosition): Promise<PieceType> {
    return new Promise<PieceType>((resolve, reject) => {
      const pieceTypeOptions = Object.values(PieceType).map(pieceType => toChar(game.gameState.activeColor, pieceType));
      prompt.question(`? promotion [ ${pieceTypeOptions.join(' | ')} ]: `, (input) => {
        if (!isChar(input)) {
          console.error('invalid choice');
          promptForPromotion(fromPos, toPos).then(resolve).catch(reject);
          return;
        }
        const promoteToPiece = fromChar(input).pieceType;
        resolve(promoteToPiece);
      });
    });
  }

  async function promptForMove(): Promise<[BoardPosition, BoardPosition]> {
    return new Promise<[BoardPosition, BoardPosition]>((resolve, reject) => {
      prompt.question('? move: ', (input) => {
        const parseMoveResult = parseMoveInput(input);
        if (parseMoveResult.isErr()) {
          const error = parseMoveResult.unwrapErr();
          console.error(error instanceof Error ? error.message : error);
          // Prompt again for the move.
          promptForMove().then(resolve).catch(reject);
        } else {
          resolve(parseMoveResult.unwrap());
        }
      });
    });
  }

  async function handleMove(fromPos: BoardPosition, toPos: BoardPosition, promoteToPieceType?: PieceType): Promise<MoveResult | void> {
    const moveResult = game.move(fromPos, toPos, promoteToPieceType);
    if (moveResult.isErr()) {
      const error = moveResult.unwrapErr();
      if (error instanceof PromotionRequiredError) {
        const promotionPieceType = await promptForPromotion(fromPos, toPos);
        return handleMove(fromPos, toPos, promotionPieceType);
      }
      console.error(error instanceof Error ? error.message : error);
      return;
    }
    return moveResult.unwrap();
  }

  while (!isGameOver(game.gameState)) {
    console.log(serialize(game.gameState));
    printBoardToUnicode(game.gameState.board, true);
    const [fromPos, toPos] = await promptForMove();
    const moveResult = await handleMove(fromPos, toPos);
    if (!moveResult) {
      continue;
    }
    let capturedPieceName = 'n/a';
    if (isColoredPieceContainer(moveResult.capturedPiece)) {
      capturedPieceName = moveResult.capturedPiece.coloredPiece.pieceType;
    }
    console.log(`${fromPos} -> ${toPos} (${moveResult.move.moveType}, capture: ${capturedPieceName})`);
  }

  printBoardToUnicode(game.gameState.board, true);
  console.log('game over');
  prompt.close();
}
main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
