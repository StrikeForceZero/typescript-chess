import {
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { BoardPos } from '../../board/BoardPositionIdentifer';
import { deserialize } from '../../fen/deserializer';
import { FENString } from '../../fen/FENString';
import { Game } from '../../game/Game';

describe('GameStateHistory', () => {
  describe('pgn', () => {
    let game = new Game();
    beforeEach(() => {
      game = new Game();
    });
    function loadScenario(fenString: FENString) {
      Object.assign(game.gameState, deserialize(fenString));
    }
    it('should maintain entries', () => {
      expect(game.gameState.history.pgn.length).toBe(0);
      game.move(BoardPos.E2, BoardPos.E4).throw();
      expect(game.gameState.history.pgn[0]?.buildString()).toBe('1. e4');
      game.move(BoardPos.F7, BoardPos.F5).throw();
      expect(game.gameState.history.pgn[0]?.buildString()).toBe('1. e4 f5');
      game.move(BoardPos.E4, BoardPos.F5).throw();
      expect(game.gameState.history.pgn[1]?.buildString()).toBe('2. exf5');
    });
    it('should maintain entries (capture)', () => {
      expect(game.gameState.history.pgn.length).toBe(0);
      game.move(BoardPos.E2, BoardPos.E4).throw();
      game.move(BoardPos.F7, BoardPos.F5).throw();
      game.move(BoardPos.E4, BoardPos.F5).throw();
      expect(game.gameState.history.pgn[1]?.buildString()).toBe('2. exf5');
    });
    it('should maintain entries (check)', () => {
      loadScenario('rnbqkbnr/pppp1ppp/8/8/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1' as FENString);
      game.move(BoardPos.D1, BoardPos.E2).throw();
      expect(game.gameState.history.pgn[0]?.buildString()).toBe('1. Qe2+');
    });
    it('should maintain entries (checkmate)', () => {
      loadScenario('3pkp2/3p1p2/8/8/8/8/PPPP1PPP/RNBQKBNR w KQ - 0 1' as FENString);
      game.move(BoardPos.D1, BoardPos.E2).throw();
      expect(game.gameState.history.pgn[0]?.buildString()).toBe('1. Qe2#');
    });
    it('should maintain entries (castle)', () => {
      loadScenario('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1' as FENString);
      game.move(BoardPos.E1, BoardPos.G1).throw();
      game.move(BoardPos.E8, BoardPos.C8).throw();
      expect(game.gameState.history.pgn[0]?.buildString()).toBe('1. O-O O-O-O');
    });
    // this is more of an e2e test to cover a bugfix
    it('should maintain entries (castle alternate)', () => {
      loadScenario('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1' as FENString);
      game.move(BoardPos.E1, BoardPos.G1).throw();
      game.move(BoardPos.E8, BoardPos.C8).throw();
      expect(game.gameState.history.pgn[0]?.buildString()).toBe('1. O-O O-O-O');
    });
    it('should maintain entries (ambiguous rank)', () => {
      loadScenario('k7/8/8/8/8/6R1/8/K3R1R1 w - - 0 1' as FENString);
      game.move(BoardPos.G1, BoardPos.F1).throw();
      expect(game.gameState.history.pgn[0]?.buildString()).toBe('1. Rgf1');
    });
    it('should maintain entries (ambiguous file)', () => {
      loadScenario('k7/8/8/8/8/6R1/8/K3R1R1 w - - 0 1' as FENString);
      game.move(BoardPos.G1, BoardPos.G2).throw();
      expect(game.gameState.history.pgn[0]?.buildString()).toBe('1. R1g2');
    });
  });
});
