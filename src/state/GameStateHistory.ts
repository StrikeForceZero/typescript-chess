import { FENString } from '../fen/FENString';
import { PgnEntryBuilder } from '../pgn/PgnEntryBuilder';

export class GameStateHistory {
  public readonly pgn: PgnEntryBuilder[] = [];
  public readonly fen: FENString[] = [];
}
