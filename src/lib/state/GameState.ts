import { Board } from '../board/Board';
import { BoardPosition } from '../board/BoardPosition';
import { ChessPiece } from '../piece/ChessPiece';
import { PieceColor } from '../piece/PieceColor';
import { CastlingRights } from './CastlingRights';
import { GameStateHistory } from './GameStateHistory';
import { GameStatus } from './GameStatus';
import { MoveCounters } from './MoveCounters';

export class GameState {
  public readonly board: Board = new Board();
  public readonly capturedPieces: ChessPiece[] = [];
  public readonly history: GameStateHistory = new GameStateHistory();
  public activeColor: PieceColor = PieceColor.White;
  public readonly moveCounters: MoveCounters = new MoveCounters();
  public gameStatus: GameStatus = GameStatus.New;
  public enPassantTargetSquare: BoardPosition | null = null;
  public readonly castlingRights: CastlingRights = new CastlingRights();
}
