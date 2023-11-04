import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { BoardFile } from '../../board/BoardFile';
import { BoardPosition } from '../../board/BoardPosition';
import { PieceType } from '../../piece/PieceType';
import { Option } from '../../utils/Option';
import {
  Check,
  Checkmate,
  Move,
  PgnEntryBuilder,
} from '../PgnEntryBuilder';

describe('PgnEntryBuilder', () => {
  it('should build string', () => {
    const pgnEntry = PgnEntryBuilder.create(1)
      .forWhite(Move.RegularMove.create({
          piece: PieceType.Pawn,
          fromDiscriminator: Option.Some(BoardFile.E),
          to: BoardPosition.fromString('e4'),
      }))
      .addCommentForWhite('comment for white')
      .forBlack(Move.RegularMove.create({
        piece: PieceType.Pawn,
        fromDiscriminator: Option.Some(BoardFile.E),
        to: BoardPosition.fromString('e6'),
      }))
      .addCommentForBlack('comment for black')
      .addComment('some comment')
    ;
    expect(pgnEntry.buildString()).toBe('1. e4 {comment for white} 1... e6 {comment for black} ;some comment\n');
  });
  it('should build string (capture)', () => {
    const pgnEntry = PgnEntryBuilder.create(1)
      .forWhite(Move.RegularMove.create({
        piece: PieceType.Bishop,
        hadCapture: true,
        to: BoardPosition.fromString('e4'),
      }))
    ;
    expect(pgnEntry.buildString()).toBe('1. Bxe4');
  });
  it('should build string (check)', () => {
    const pgnEntry = PgnEntryBuilder.create(1)
      .forWhite(Move.RegularMove.create({
        piece: PieceType.Bishop,
        checkInfo: Check,
        to: BoardPosition.fromString('e4'),
      }))
    ;
    expect(pgnEntry.buildString()).toBe('1. Be4+');
  });
  it('should build string (checkmate)', () => {
    const pgnEntry = PgnEntryBuilder.create(1)
      .forWhite(Move.RegularMove.create({
        piece: PieceType.Bishop,
        checkInfo: Checkmate,
        to: BoardPosition.fromString('e4'),
      }))
    ;
    expect(pgnEntry.buildString()).toBe('1. Be4#');
  });
});
