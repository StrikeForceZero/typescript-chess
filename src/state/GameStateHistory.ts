import { FENString } from '../fen/FENString';

export class GameStateHistory {
  public readonly pgn: string[] = [];
  public readonly fen: FENString[] = [];
}
