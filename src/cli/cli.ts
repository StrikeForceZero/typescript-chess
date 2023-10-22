import { BoardPosition } from '../board/BoardPosition';
import { serialize } from '../fen/serialize';
import { Game } from '../game/Game';
import { isColoredPieceContainer } from '../piece/ChessPiece';
import { isGameOver } from '../state/utils/GameStatusUtils';
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

  while (!isGameOver(game.gameState)) {
    console.log(serialize(game.gameState));
    printBoardToUnicode(game.gameState.board, true);
    const [fromPos, toPos] = await promptForMove();
    const moveResult = game.move(fromPos, toPos);
    if (moveResult.isErr()) {
      const error = moveResult.unwrapErr();
      console.error(error instanceof Error ? error.message : error);
      continue;
    }
    const matchedMove = moveResult.unwrap();
    let capturedPieceName = 'n/a';
    if (isColoredPieceContainer(matchedMove.capturedPiece)) {
      capturedPieceName = matchedMove.capturedPiece.coloredPiece.pieceType;
    }
    console.log(`${fromPos} -> ${toPos} (${matchedMove.move.moveType}, capture: ${capturedPieceName})`);
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
