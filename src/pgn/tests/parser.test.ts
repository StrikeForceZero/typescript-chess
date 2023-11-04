import {
  describe,
  expect,
  it,
} from '@jest/globals';
import {
  parse,
  parseEntries,
} from '../parser';

describe('parser', () => {
  describe('parse', () => {
    it('should parse header', () => {
      const pgn = [
        `[Event "F/S Return Match"]`,
        `[Site "Belgrade, Serbia JUG"]`,
        `[Date "1992.11.04"]`,
        `[Round "29"]`,
        `[White "Fischer, Robert J."]`,
        `[Black "Spassky, Boris V."]`,
        `[Result "1/2-1/2"]`,
      ].join('\n');
      expect(JSON.parse(JSON.stringify(parse(pgn)))).toStrictEqual({
        roster: {
          Event: 'F/S Return Match',
          Site: 'Belgrade, Serbia JUG',
          Date: '1992.11.04',
          Round: '29',
          White: 'Fischer, Robert J.',
          Black: 'Spassky, Boris V.',
          Result: '1/2-1/2',
        },
        moves: [],
      });
    });
    it('should parse simple header and moves', () => {
      const pgn = [
        `[Event "F/S Return Match"]`,
        `1. e4 e5 2. e3 e6`, // 2 on one line
        `3. f4 f5`, // 3rd one on next
      ].join('\n');
      expect(JSON.parse(JSON.stringify(parse(pgn)))).toStrictEqual({
        roster: {
          Event: 'F/S Return Match',
        },
        moves: [
          { moveNumber: 1,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'pawn',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'e' },
              to: { file: 'e', rank: 4 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          blackMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'pawn',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'e' },
              to: { file: 'e', rank: 5 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } } },
          { moveNumber: 2,
            whiteMoveData:
              { checkInfo: { _tag: 'NoCheck' },
                piece: 'pawn',
                hadCapture: false,
                fromDiscriminator: { type: 'some', value: 'e' },
                to: { file: 'e', rank: 3 },
                _tag: 'RegularMove',
                _: { tag: 'RegularMove' } },
            blackMoveData:
              { checkInfo: { _tag: 'NoCheck' },
                piece: 'pawn',
                hadCapture: false,
                fromDiscriminator: { type: 'some', value: 'e' },
                to: { file: 'e', rank: 6 },
                _tag: 'RegularMove',
                _: { tag: 'RegularMove' } } },
          { moveNumber: 3,
            whiteMoveData:
              { checkInfo: { _tag: 'NoCheck' },
                piece: 'pawn',
                hadCapture: false,
                fromDiscriminator: { type: 'some', value: 'f' },
                to: { file: 'f', rank: 4 },
                _tag: 'RegularMove',
                _: { tag: 'RegularMove' } },
            blackMoveData:
              { checkInfo: { _tag: 'NoCheck' },
                piece: 'pawn',
                hadCapture: false,
                fromDiscriminator: { type: 'some', value: 'f' },
                to: { file: 'f', rank: 5 },
                _tag: 'RegularMove',
                _: { tag: 'RegularMove' } } },
        ],
      });
    });
  });
  describe('parseEntries', () => {
    it('should parse single', () => {
      const entries = `1. e4 {comment for white move} e5 {comment for blacks move} ;end of line comment`.split('\n');
      const parsedEntries = parseEntries(entries);
      const pojoEntries = JSON.parse(JSON.stringify(parsedEntries));
      expect(pojoEntries).toStrictEqual([
        {
          moveNumber: 1,
          whiteMoveData:
            { _: { tag: 'RegularMove' },
              _tag: 'RegularMove',
              checkInfo: { _tag: 'NoCheck' },
              fromDiscriminator: { type: 'some', value: 'e' },
              hadCapture: false,
              piece: 'pawn',
              to: { file: 'e', rank: 4 } },
          whiteComment: 'comment for white move',
          blackMoveData:
            { _: { tag: 'RegularMove' },
              _tag: 'RegularMove',
              checkInfo: { _tag: 'NoCheck' },
              fromDiscriminator: { type: 'some', value: 'e' },
              hadCapture: false,
              piece: 'pawn',
              to: { file: 'e', rank: 5 } },
          blackComment: 'comment for blacks move',
          comment: 'end of line comment',
        },
      ]);
    });
    it('should parse', () => {
      const entries = `1. e4 e5 {comment for blacks move} 2. Nf3 Nc6 3. Bb5 {This opening is called the Ruy Lopez.} 3... a6 ;end of line comment\n4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8+ 10. d4 Nbd7#`.split('\n');
      const parsedEntries = parseEntries(entries);
      const pojoEntries = JSON.parse(JSON.stringify(parsedEntries));
      expect(pojoEntries).toStrictEqual([
        { moveNumber: 1,
        whiteMoveData:
          { checkInfo: { _tag: 'NoCheck' },
            piece: 'pawn',
            hadCapture: false,
            fromDiscriminator: { type: 'some', value: 'e' },
            to: { file: 'e', rank: 4 },
            _tag: 'RegularMove',
            _: { tag: 'RegularMove' } },
        blackMoveData:
          { checkInfo: { _tag: 'NoCheck' },
            piece: 'pawn',
            hadCapture: false,
            fromDiscriminator: { type: 'some', value: 'e' },
            to: { file: 'e', rank: 5 },
            _tag: 'RegularMove',
            _: { tag: 'RegularMove' } },
        blackComment: 'comment for blacks move' },
        { moveNumber: 2,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'knight',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'f' },
              to: { file: 'f', rank: 3 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          blackMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'knight',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'c' },
              to: { file: 'c', rank: 6 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } } },
        { moveNumber: 3,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'bishop',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'b' },
              to: { file: 'b', rank: 5 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          whiteComment: 'This opening is called the Ruy Lopez.',
          blackMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'pawn',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'a' },
              to: { file: 'a', rank: 6 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          comment: 'end of line comment' },
        { moveNumber: 4,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'bishop',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'a' },
              to: { file: 'a', rank: 4 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          blackMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'knight',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'f' },
              to: { file: 'f', rank: 6 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } } },
        { moveNumber: 5,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              castleSide: 'king-side',
              _tag: 'CastleMove',
              _: { tag: 'CastleMove' } },
          blackMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'bishop',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'e' },
              to: { file: 'e', rank: 7 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } } },
        { moveNumber: 6,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'rook',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'e' },
              to: { file: 'e', rank: 1 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          blackMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'pawn',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'b' },
              to: { file: 'b', rank: 5 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } } },
        { moveNumber: 7,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'bishop',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'b' },
              to: { file: 'b', rank: 3 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          blackMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'pawn',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'd' },
              to: { file: 'd', rank: 6 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } } },
        { moveNumber: 8,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'pawn',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'c' },
              to: { file: 'c', rank: 3 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          blackMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              castleSide: 'king-side',
              _tag: 'CastleMove',
              _: { tag: 'CastleMove' } } },
        { moveNumber: 9,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'pawn',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'h' },
              to: { file: 'h', rank: 3 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          blackMoveData:
            { checkInfo: { isCheck: true, _tag: 'Check' },
              piece: 'knight',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'b' },
              to: { file: 'b', rank: 8 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } } },
        { moveNumber: 10,
          whiteMoveData:
            { checkInfo: { _tag: 'NoCheck' },
              piece: 'pawn',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'd' },
              to: { file: 'd', rank: 4 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } },
          blackMoveData:
            { checkInfo: { isCheckmate: true, _tag: 'Checkmate' },
              piece: 'knight',
              hadCapture: false,
              fromDiscriminator: { type: 'some', value: 'b' },
              to: { file: 'd', rank: 7 },
              _tag: 'RegularMove',
              _: { tag: 'RegularMove' } } },
      ]);
    });
  });
});
