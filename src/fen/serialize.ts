import { Board } from '../board/Board';
import { boardFileGenerator } from '../board/utils/BoardFileUtils';
import { boardRankReverseGenerator } from '../board/utils/BoardRankUtils';
import { toChar as chessPieceToChar } from '../piece/ChessPiece';
import { toChar } from '../piece/ChessPieceAsciiChar';
import {
  PieceColor,
  toChar as colorToChar,
} from '../piece/PieceColor';
import {
  PieceType,

} from '../piece/PieceType';
import { GameState } from '../state/GameState';
import {
  FENString,
  FENStringBoardOnly,
} from './FENString';

export function serializeBoardOnlyFENString(board: Board): FENStringBoardOnly {
  let boardPosFen = '';
  for (const rank of boardRankReverseGenerator()) {
    let emptyCount = 0;

    const processEmpty = () => {
      if (emptyCount > 0) {
        boardPosFen += emptyCount.toString();
        emptyCount = 0;
      }
    };

    for (const file of boardFileGenerator()) {
      const maybePiece = board.getPiece(file, rank);
      if (maybePiece.isSome()) {
        processEmpty();
        // Serialize the piece to its FEN representation
        const pieceChar = chessPieceToChar(maybePiece.value);
        boardPosFen += pieceChar;
      }
      else {
        emptyCount++;
      }
    }
    processEmpty();
    if (rank !== 1) {
      boardPosFen += '/';
    }
  }
  return boardPosFen as FENStringBoardOnly;
}

export function serialize(gameState: GameState): FENString {
  let fen = '';

  // 1. Piece placement
  fen += serializeBoardOnlyFENString(gameState.board);

  // 2. Active color
  const activeColor = colorToChar(gameState.activeColor);
  fen += ` ${activeColor} `;

  // 3. Castling availability
  const castling = gameState.castlingRights;
  fen += castling.white.kingSide ? toChar(PieceColor.White, PieceType.King) : '';
  fen += castling.white.queenSide ? toChar(PieceColor.White, PieceType.Queen) : '';
  fen += castling.black.kingSide ? toChar(PieceColor.Black, PieceType.King) : '';
  fen += castling.black.queenSide ? toChar(PieceColor.Black, PieceType.Queen) : '';
  if (fen.endsWith(' ')) {
    fen += '- ';
  }
  else {
    fen += ' ';
  }

  // 4. En passant target square
  fen += gameState.enPassantTargetSquare ? gameState.enPassantTargetSquare.toString() : '-';

  // 5. Half-move clock
  fen += ' ' + gameState.moveCounters.halfMoveClock.toString();

  // 6. Full-move number
  fen += ' ' + gameState.moveCounters.fullMoveNumber.toString();

  return fen as FENString;
}
