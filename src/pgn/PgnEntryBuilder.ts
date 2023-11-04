import { Alge } from 'alge';
import { z } from 'zod';

import { BoardFile } from '../board/BoardFile';
import { BoardRank } from '../board/BoardRank';
import { CastleSide } from '../board/CastleSide';
import {
  PieceType,
  toChar,
} from '../piece/PieceType';
import { Option } from '../utils/Option';
import {
  CaptureSymbol,
  CastleSideToPgnMap,
  CheckmateSymbol,
  CheckOrMateSuffix,
  CheckSymbol,
  EmptyString,
  PgnEntry,
  PgnMoveData,
  PlayerMoveEntry,
} from './PGN';

// noinspection PointlessBooleanExpressionJS
const True = z.boolean().refine(value => value === true, { message: 'Value must be true' });
// noinspection PointlessBooleanExpressionJS
const False = z.boolean().refine(value => value === false, { message: 'Value must be false' });

const BoardPositionDef = z.object({
  file: z.nativeEnum(BoardFile),
  rank: z.nativeEnum(BoardRank),
});

export const CheckInfo = Alge.data('CheckInfo', {
  NoCheck: {
    isCheck: False.optional(),
    isCheckmate: False.optional(),
  },
  Check: {
    isCheck: True,
    isCheckmate: False.optional(),
  },
  Checkmate: {
    isCheck: False.optional(),
    isCheckmate: True,
  },
});
type CheckInfoInferred = Alge.Infer<typeof CheckInfo>;
export type CheckInfo = CheckInfoInferred['*'];

export const NoCheck = CheckInfo.NoCheck.create({});
export const Check = CheckInfo.Check.create({ isCheck: true });
export const Checkmate = CheckInfo.Checkmate.create({ isCheckmate: true });

const OptionSchemaFactory = <T>() => z.custom<Option<T>>(value => value instanceof Option, {
  message: 'Must be an instance of Option',
});

export const Move = Alge.data('Move', {
  RegularMove: {checkInfo: CheckInfo.schema.optional(),
    piece: z.nativeEnum(PieceType),
    hadCapture: z.boolean().optional(),
    fromDiscriminator: OptionSchemaFactory<BoardFile | BoardRank>().optional(),
    to: BoardPositionDef,
  },
  CastleMove: {
    checkInfo: CheckInfo.schema.optional(),
    castleSide: z.nativeEnum(CastleSide),
  },
});
type MoveInferred = Alge.Infer<typeof Move>;
export type Move = MoveInferred['*'];

function same_tag(a: { _tag: string }, b: { _tag: string }): boolean {
  return a._tag === b._tag;
}

export class PgnEntryBuilder {
  private whiteMove: Move | undefined;
  private whiteMoveComment: string | undefined;
  private blackMove: Move | undefined;
  private blackMoveComment: string | undefined;
  private comment: string | undefined;

  private constructor(
    private moveNumber: number,
  ) {
  }

  public static create(moveNumber: number): PgnEntryBuilder {
    return new PgnEntryBuilder(moveNumber);
  }

  public forWhite(move: Move): PgnEntryBuilder {
    this.whiteMove = move;
    return this;
  }

  public forBlack(move: Move): PgnEntryBuilder {
    this.blackMove = move;
    return this;
  }

  public addComment(comment: string): PgnEntryBuilder {
    this.comment = comment;
    return this;
  }

  public addCommentForWhite(comment: string): PgnEntryBuilder {
    this.whiteMoveComment = comment;
    return this;
  }

  public addCommentForBlack(comment: string): PgnEntryBuilder {
    this.blackMoveComment = comment;
    return this;
  }

  private buildFromMove(move: Move): PlayerMoveEntry {
    let suffix: CheckOrMateSuffix = EmptyString;
    const checkInfo = move.checkInfo;
    if (checkInfo !== undefined) {
      // TODO: why are these is() checks broken?
      if (CheckInfo.Check.is(checkInfo) || same_tag(Check, checkInfo)) {
        suffix = CheckSymbol;
      }
      // TODO: why are these is() checks broken?
      else if (CheckInfo.Checkmate.is(checkInfo) || same_tag(Checkmate, checkInfo)) {
        suffix = CheckmateSymbol;
      }
    }
    let entry: PlayerMoveEntry | EmptyString = EmptyString;
    if (Move.CastleMove.is(move)) {
      entry += CastleSideToPgnMap[move.castleSide];
    }
    else {
      if (move.piece === PieceType.Pawn) {
        if (!move.fromDiscriminator?.isSome()) {
          throw new Error('pawn moves require a from discriminator');
        }
        entry += `${move.fromDiscriminator.unwrap()}`;
      }
      else {
        entry += `${toChar(move.piece)}${move.fromDiscriminator?.isSome() ? move.fromDiscriminator.unwrap() : EmptyString}`;
      }
      if (move.hadCapture) {
        entry += CaptureSymbol;
      }
      // prevent redundancies
      const toFile = move.fromDiscriminator?.isSome() && move.fromDiscriminator.unwrap() === move.to.file ? undefined : move.to.file;
      const toRank = move.fromDiscriminator?.isSome() && move.fromDiscriminator.unwrap() === move.to.rank ? undefined : move.to.rank;
      entry += [toFile, toRank].filter(v => v !== undefined).join('');
    }
    return `${entry}${suffix}` as PlayerMoveEntry;
  }

  private buildWhite(): PlayerMoveEntry {
    if (!this.whiteMove) {
      throw new Error(`white's move was not provided!`);
    }
    return this.buildFromMove(this.whiteMove);
  }

  private buildBlack(): PlayerMoveEntry | undefined {
    if (!this.blackMove) {
      return;
    }
    return this.buildFromMove(this.blackMove);
  }

  public buildString(): PgnEntry {
    const moveNumber = `${this.moveNumber}.`;
    const whitesMove = this.buildWhite();
    const blacksMove = this.buildBlack();
    const whiteMoveComment = this.whiteMoveComment ? `{${this.whiteMoveComment}}` : undefined;
    const blackMoveComment = this.blackMoveComment ? `{${this.blackMoveComment}}` : undefined;
    const comment = this.comment ? `;${this.comment}\n` : undefined;
    const blackMoveContinuation = whiteMoveComment ? `${this.moveNumber}...` : undefined;

    return [
      moveNumber,
      whitesMove,
      whiteMoveComment,
      blackMoveContinuation,
      blacksMove,
      blackMoveComment,
      comment,
    ]
      .filter(v => v !== undefined)
      .join(' ')
    ;
  }

  public data(): PgnMoveData {
    return {
      moveNumber: this.moveNumber,
      whiteMoveData: this.whiteMove,
      whiteComment: this.whiteMoveComment,
      blackMoveData: this.blackMove,
      blackComment: this.blackMoveComment,
      comment: this.comment,
    } as Partial<PgnMoveData>; // ain't no one got time to work around exactOptionalPropertyTypes
  }
}
