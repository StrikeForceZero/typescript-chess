import { BoardPosition } from '../board/BoardPosition';
import { BoardSquare } from '../board/BoardSquare';
import {
  from as chessPieceFromColoredPiece,
  NoPiece,
} from '../piece/ChessPiece';
import { fromChar as coloredPieceFromChar } from '../piece/ColoredPiece';
import { fromChar as colorFromChar } from '../piece/PieceColor';
import { GameState } from '../state/GameState';
import { FENString } from './FENString';

export function parseRank(rank: string, squares: Generator<BoardSquare>): void {
  for (const char of rank) {
    const isDigit = /\d/.test(char);

    if (isDigit) {
      const numEmptySquares = Number(char);
      for (let ix = 0; ix < numEmptySquares; ix++) {
        const next = squares.next();
        if (next.done) throw new Error(`Ran out of squares while processing rank string '${rank}' at character '${char}': empty ${ix + 1}/${numEmptySquares}`);
        next.value.piece = NoPiece;
      }
    } else {
      const next = squares.next();
      if (next.done) throw new Error(`Ran out of squares while processing rank string '${rank}' at character '${char}'`);
      next.value.piece = chessPieceFromColoredPiece(coloredPieceFromChar(char));
    }
  }
}

export function deserialize(fen: FENString): GameState {
  const gameState = new GameState();
  const parts = fen.split(' ');

  if (parts.length !== 6) {
    throw new Error('invalid FEN');
  }

  const [
    boardString,
    activeColorString,
    castleRightsString,
    enPassantTargetSquareString,
    halfMoveClockString,
    fullMoveNumberString,
  ] = parts;

  if (
    !boardString
    || !activeColorString
    || !castleRightsString
    || !enPassantTargetSquareString
    || !halfMoveClockString
    || !fullMoveNumberString
  ) {
    throw new Error('Invalid FEN');
  }

  // 1. Piece placement
  const squares = gameState.board.iterate();
  for (const rank of boardString.split('/').reverse()) {
    parseRank(rank, squares);
  }

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

  return gameState;
}
