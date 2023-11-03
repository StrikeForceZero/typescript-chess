import { deserializeBoardOnlyFENString } from '../../fen/deserializer';
import { StandardStartPositionBoardOnlyFEN } from '../../fen/FENString';
import { serializeBoardOnlyFENString } from '../../fen/serialize';
import { deepFreeze } from '../../utils/deepFreeze';
import { Board } from '../Board';
import { BoardPosition } from '../BoardPosition';

export function isBoardAtStartingPos(board: Board): boolean {
  return serializeBoardOnlyFENString(board) === StandardStartPositionBoardOnlyFEN;
}

const startingPosBoard = deepFreeze(deserializeBoardOnlyFENString(StandardStartPositionBoardOnlyFEN));

// will return true for comparing empty squares A3-F8
export function isPieceAtStartingPos(board: Board, pos: BoardPosition): boolean {
  return startingPosBoard.getPieceFromPos(pos).isValueEqual(board.getPieceFromPos(pos));
}
