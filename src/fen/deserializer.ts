import { Board } from '../board/Board';
import { BoardPosition } from '../board/BoardPosition';
import { BoardSquare } from '../board/BoardSquare';
import { fromChar as chessPieceFromChar } from '../piece/ChessPiece';
import { fromChar as colorFromChar } from '../piece/PieceColor';
import { GameState } from '../state/GameState';
import { charIterator } from '../utils/char';
import { Option } from '../utils/Option';
import {
  FENString,
  FENStringBoardOnly,
  getParts,
} from './FENString';

export function parseRank(rank: string, squares: Generator<BoardSquare>): void {
  for (const char of charIterator(rank)) {
    const isDigit = /\d/.test(char);

    if (isDigit) {
      const numEmptySquares = Number(char);
      for (let ix = 0; ix < numEmptySquares; ix++) {
        const next = squares.next();
        if (next.done) throw new Error(`Ran out of squares while processing rank string '${rank}' at character '${char}': empty ${ix + 1}/${numEmptySquares}`);
        next.value.piece = Option.None();
      }
    }
    else {
      const next = squares.next();
      if (next.done) throw new Error(`Ran out of squares while processing rank string '${rank}' at character '${char}'`);
      next.value.piece = Option.Some(chessPieceFromChar(char));
    }
  }
}

export function deserializeBoardOnlyFENString(boardString: FENStringBoardOnly, board: Board = new Board()): Board {
  const squares = board.iterate();
  for (const rank of boardString.split('/').reverse()) {
    parseRank(rank, squares);
  }
  return board;
}

export function deserialize(fen: FENString): GameState {
  const gameState = new GameState();

  const [
    boardString,
    activeColorString,
    castleRightsString,
    enPassantTargetSquareString,
    halfMoveClockString,
    fullMoveNumberString,
  ] = getParts(fen);

  // 1. Piece placement
  deserializeBoardOnlyFENString(boardString as FENStringBoardOnly, gameState.board);

  // 2. Active color
  gameState.activeColor = colorFromChar(activeColorString!);

  // 3. Castling availability
  gameState.castlingRights.white.kingSide = castleRightsString.includes('K');
  gameState.castlingRights.white.queenSide = castleRightsString.includes('Q');
  gameState.castlingRights.black.kingSide = castleRightsString.includes('k');
  gameState.castlingRights.black.queenSide = castleRightsString.includes('q');

  // 4. En passant target square
  gameState.enPassantTargetSquare = enPassantTargetSquareString !== '-' ? BoardPosition.fromString(enPassantTargetSquareString) : null;

  // 5. Half-move clock
  gameState.moveCounters.halfMoveClock = Number(halfMoveClockString);

  // 6. Full-move number
  gameState.moveCounters.fullMoveNumber = Number(fullMoveNumberString);

  gameState.history.fen.push(fen);

  return gameState;
}
