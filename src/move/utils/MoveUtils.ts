import { BoardPosition } from '../../board/BoardPosition';
import { ExecutableMove } from '../ExecutableMove';

export function isSameMoveFactory(fromPos: BoardPosition, toPos: BoardPosition) {
  return (move: ExecutableMove) => {
    return move.fromPos.toString() === fromPos.toString() && move.toPos.toString() === toPos.toString();
  };
}