import {
  BoardFile,
  fromChar as fileFromChar,
} from '../board/BoardFile';
import {
  BoardRank,
  BoardRankChar,
  fromChar as rankFromChar,
} from '../board/BoardRank';
import { CastleSide } from '../board/CastleSide';
import {
  fromChar as pieceFromChar,
  PieceAsciiChar,
  PieceType,
} from '../piece/PieceType';
import { Option } from '../utils/Option';
import {
  CaptureSymbol,
  CheckmateSymbol,
  CheckSymbol,
  PGNData,
  PgnMoveData,
} from './PGN';
import {
  CheckInfo,
  Move,
} from './PgnEntryBuilder';

function parseTagPair(tagPairString: string): Record<string, string> {
  const result = /^\[(\w+)\s+"(.*?)"]$/.exec(tagPairString);
  if (result === null) {
    throw new Error('invalid tag pair!');
  }
  const [_full, key, value] = result;
  if (key === undefined || value === undefined) {
    throw new Error('invalid tag pair!');
  }
  return {
    [key]: value,
  };
}

// /(\d+\.)\s(?:(?:[NBRQK]?[a-h]?[1-8]?x?[a-h]?[1-8])|O-O-O|O-O)[#+]?\s(\{.*?}\s\1\.\.\s)?(?:(?:(?:[NBRQK]?[a-h]?[1-8]?x?[a-h]?[1-8](?![-/]))|O-O-O|O-O)[#+]?)?(?:(?:\{.*?}|;.*?\n))?/

enum ParserBlock {
  New,
  WhiteMove,
  WhiteCommentStart,
  WhiteCommentEnd,


  MoveContinuationAfterComment,

  BlackMove,
  BlackCommentStart,
  BlackCommentEnd,
  CommentUntilEndOfTheLineStart,
  CommentUntilEndOfTheLineEnd,

  Result,
}

function getCastleData(word: string): Move {
  return Move.CastleMove.create({
    castleSide: word.startsWith('O-O-O') ? CastleSide.QueenSide : CastleSide.KingSide,
    checkInfo: word.includes(CheckSymbol)
      ? CheckInfo.Check.create({ isCheck: true })
      : word.includes(CheckmateSymbol)
        ? CheckInfo.Checkmate.create({ isCheckmate: true })
        : CheckInfo.NoCheck.create({}),
  });
}

function getMoveData(word: string): Move {
  const result = /([NBRQK])?([a-h])?([1-8])?(x)?([a-h])?([1-8])([+#])?/.exec(word);
  if (!result) {
    throw new Error('invalid PGN entry!');
  }
  const [
    _full,
    ...rest
  ] = result;
  if (!_full) {
    throw new Error('whoops');
  }
  let [
    piece,
    discriminatorFile,
    discriminatorRankOrTargetRank,
    isCapture,
    targetFile,
    targetRank,
    isCheckOrMate,
  ] = rest;
  [
    piece,
    discriminatorFile,
    discriminatorRankOrTargetRank,
    isCapture,
    targetFile,
    targetRank,
    isCheckOrMate,
  ] = [
    piece ?? '',
    discriminatorFile ?? '',
    discriminatorRankOrTargetRank ?? '',
    isCapture ?? '',
    targetFile ?? '',
    targetRank ?? '',
    isCheckOrMate ?? '',
  ];
  // if we have targetRank, we can use discriminatorRankOrTargetRank as fallback, otherwise we can only rely on discriminatorFile
  const fromDiscriminator = targetRank ? discriminatorFile ?? discriminatorRankOrTargetRank : discriminatorFile;
  const fromDiscriminatorOption: Option<BoardFile | BoardRank> = fromDiscriminator
    ? Option.Some<BoardFile | BoardRank>(fromDiscriminator as BoardFile | BoardRank)
    : Option.None<BoardFile | BoardRank>();
  return Move.RegularMove.create({
    fromDiscriminator: fromDiscriminatorOption,
    to: {
      file: fileFromChar((targetFile ? targetFile : discriminatorFile) as BoardFile),
      rank: rankFromChar((targetRank ? targetRank : discriminatorRankOrTargetRank) as BoardRankChar),
    },
    hadCapture: isCapture === CaptureSymbol,
    piece: piece ? pieceFromChar(piece as PieceAsciiChar) : PieceType.Pawn,
    checkInfo: isCheckOrMate.includes(CheckSymbol)
      ? CheckInfo.Check.create({ isCheck: true })
      : isCheckOrMate.includes(CheckmateSymbol)
        ? CheckInfo.Checkmate.create({ isCheckmate: true })
        : CheckInfo.NoCheck.create({}),
  });
}

export function parseEntries(lines: readonly string[]): PgnMoveData[] {
  const moves: PgnMoveData[] = [];
  for (const line of lines) {
    let state = ParserBlock.New;
    let move: PgnMoveData = {};
    const words = line.split(' ');
    for (let ix = 0; ix < words.length; ix++) {
      const word = words[ix]!;
      // 1.
      if (state === ParserBlock.New) {
        move = {};
        if (/\d\./.test(word)) {
          // parseInt because we discard everything after the number
          move.moveNumber = parseInt(word, 10);
          state = ParserBlock.WhiteMove;
        }
      }
      // Bf6
      // f4
      // Nxf7
      // O-O
      // O-O-O
      // Ra6+
      // Nf4#
      else if (state === ParserBlock.WhiteMove) {
        if (word.startsWith('O-O')) {
          move.whiteMoveData = getCastleData(word);
        }
        else {
          move.whiteMoveData = getMoveData(word);
        }
        state = ParserBlock.WhiteCommentStart;
      }
      // {...
      else if (state === ParserBlock.WhiteCommentStart) {
        if (!word.startsWith('{')) {
          // not a comment so start looking for black moves
          if (move.whiteComment === undefined) {
            state = ParserBlock.BlackMove;
          }
          // not a comment, so we need to loop again on the same word
          ix--;
          continue;
        }
        // make sure we initialize the comment with empty
        move.whiteComment ??= '';
        move.whiteComment += word;
        state = ParserBlock.WhiteCommentEnd;
      }
      // ...}
      else if (state === ParserBlock.WhiteCommentEnd) {
        if (word.endsWith('}')) {
          state = ParserBlock.MoveContinuationAfterComment;
        }
        move.whiteComment += ' ' + word;
      }
      // TODO: are these required after white move comments?
      // 1...
      else if (state === ParserBlock.MoveContinuationAfterComment) {
        if (/\d\./.test(word)) {
          // parseInt because we discard everything after the number
          // sanity check and make sure we are reading the correct continuation
          if (move.moveNumber !== parseInt(word, 10)) {
            throw new Error(`invalid move number after comment! expected: ${move.moveNumber} got: ${parseInt(word, 10)}`);
          }
        }
        else {
          // since we didn't encounter the move continuation after comment we have to loop again on the same word
          ix--;
        }
        state = ParserBlock.BlackMove;
      }
      // Bf6
      // f4
      // Nxf7
      // O-O
      // O-O-O
      // Ra6+
      // Nf4#
      else if (state === ParserBlock.BlackMove) {
        if (word.startsWith('O-O')) {
          move.blackMoveData = getCastleData(word);
        }
        else {
          move.blackMoveData = getMoveData(word);
        }
        state = ParserBlock.BlackCommentStart;
      }
      // {...
      else if (state === ParserBlock.BlackCommentStart) {
        if (!word.startsWith('{')) {
          // not a comment so start looking for end of line comments
          if (move.blackComment === undefined) {
            state = ParserBlock.CommentUntilEndOfTheLineStart;
          }
          // not a comment, so we need to loop again on the same word
          ix--;
          continue;
        }
        // make sure we initialize the comment with empty
        move.blackComment ??= '';
        move.blackComment += word;
        state = ParserBlock.BlackCommentEnd;
      }
      // ...}
      else if (state === ParserBlock.BlackCommentEnd) {
        if (word.endsWith('}')) {
          state = ParserBlock.CommentUntilEndOfTheLineStart;
        }
        move.blackComment += ' ' + word;
      }
      // ;...
      else if (state === ParserBlock.CommentUntilEndOfTheLineStart) {
        if (!word.startsWith(';')) {
          // not an end of line comment so we start over
          state = ParserBlock.New;
          // save the current move
          moves.push(move);
          // reset move
          move = {};
          // we need to loop again on the same word
          ix--;
          continue;
        }
        // make sure we initialize the comment with empty
        move.comment ??= '';
        move.comment += word;
        state = ParserBlock.CommentUntilEndOfTheLineEnd;
      }
      // ...\n
      else if (state === ParserBlock.CommentUntilEndOfTheLineEnd) {
        move.comment += ' ' + word;
        // we let this continue till the end of the line which is the next outer loop
      }
    }
    // start over
    state = ParserBlock.New;
    // save the current move
    moves.push(move);
    // reset move
    move = {};
  }
  return moves.map(move => {
    // exactOptionalPropertyTypes forces us to check for the property to exist, so we aren't assigning undefined
    if(move.whiteComment) {
      // removes { and }
      move.whiteComment = move.whiteComment.slice(1, -1);
    }
    if(move.blackComment) {
      // removes { and }
      move.blackComment = move.blackComment.slice(1, -1);
    }
    if (move.comment) {
      // removes ;
      move.comment = move.comment.slice(1);
    }
    return move;
  });
}

export function parse(input: string): PGNData {
  let tagPairs: Record<string, string> = {};
  const lines = input.split('\n');
  const moves: PgnMoveData[] = [];
  for (const [ix, line] of lines.entries()) {
    if (line.startsWith('[')) {
      tagPairs = {
        ...tagPairs,
        ...parseTagPair(line),
      };
      continue;
    }
    moves.push(...parseEntries(lines.slice(ix)));
    break;
  }
  return {
    roster: tagPairs as PGNData['roster'],
    moves,
  };
}
