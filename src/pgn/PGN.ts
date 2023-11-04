import { BoardFile } from '../board/BoardFile';
import { BoardRank } from '../board/BoardRank';
import { CastleSide } from '../board/CastleSide';
import { FENString } from '../fen/FENString';
// import { PieceAsciiChar } from '../piece/PieceType';
import { Move } from './PgnEntryBuilder';

// prevents TS2590: Expression produces a union type that is too complex to represent.
// type ZeroThroughNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// type UpToDoubleDigit = `${ZeroThroughNine}${ZeroThroughNine}`
type UpToTripleDigit = number; // ZeroThroughNine | UpToDoubleDigit | `${UpToDoubleDigit}${ZeroThroughNine}`
type Letter = string; //'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

enum SevenTagRoster {
  Event = 'Event',
  Site = 'Site',
  Date = 'Date',
  Round = 'Round',
  White = 'White',
  Black = 'Black',
  Result = 'Result',

  Annotator = 'Annotator',
  PlyCount = 'PlyCount',
  TimeControl = 'TimeControl',
  Time = 'Time',
  Termination = 'Termination',
  Mode = 'Mode',
  FEN = 'FEN',
  SetUp = 'SetUp',
}

export const WhiteWin = '1-0';
export const BlackWin = '0-1';
export const Draw = '1/2-1/2';
export const GameInProgress = '*';

export type TagPair<Key extends string, Value extends string | number> = `[${Key} "${Value}"]`;

export type InternationalOlympicCommitteeCode = `${Letter}${Letter}${Letter}`;
type City = string;
type Region = string;
type Country = InternationalOlympicCommitteeCode;

// type Y = ZeroThroughNine;
// type M = ZeroThroughNine;
// type D = ZeroThroughNine;
// type YYYY = `${Y}${Y}${Y}${Y}`;
// type MM = `${M}${M}`;
// type DD = `${D}${D}`;
// TODO: maybe we got too ambitious here
// TS2590: Expression produces a union type that is too complex to represent.
type DateValue = string; // `${YYYY}.${MM}.${DD}`;
type LastName = string;
type FirstName = string;
type Name = `${LastName}, ${FirstName}`;
type ResultValue = typeof WhiteWin | typeof BlackWin | typeof Draw | typeof GameInProgress;

export const ModeOTB = 'OTB';
export const ModeInternet = 'ICS';
type ModeValue = typeof ModeOTB | typeof ModeInternet;

// type H = ZeroThroughNine;
// type S = ZeroThroughNine;
// type HH = `${H}${H}`;
// type SS = `${S}${S}`;
// TODO: maybe we got too ambitious here
// TS2590: Expression produces a union type that is too complex to represent.
type TimeValue = string; // `${HH}:${MM}:${SS}`;

type InferValueFromTagPair<T> = T extends TagPair<string, infer Value> ? Value : never;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TagPairFormat {
  export type Event = TagPair<SevenTagRoster.Event, string>;
  export type Site = TagPair<SevenTagRoster.Event, `${City}, ${Region} ${Country}`>;
  export type Date = TagPair<SevenTagRoster.Event, DateValue>;
  export type Round = TagPair<SevenTagRoster.Event, UpToTripleDigit>;
  export type White = TagPair<SevenTagRoster.Event, Name>;
  export type Black = TagPair<SevenTagRoster.Event, Name>;
  export type Result = TagPair<SevenTagRoster.Event, ResultValue>;

  export type Annotator = TagPair<SevenTagRoster.Event, string>;
  export type PlyCount = TagPair<SevenTagRoster.Event, number>;
  export type TimeControl = TagPair<SevenTagRoster.Event, `${number}/${number}:${number}`>;
  export type Time = TagPair<SevenTagRoster.Event, TimeValue>;
  export type Termination = TagPair<SevenTagRoster.Event, string>;
  export type Mode = TagPair<SevenTagRoster.Event, ModeValue>;
  export type FEN = TagPair<SevenTagRoster.Event, FENString>;
  export type SetUp = TagPair<SevenTagRoster.Event, 1>;
}

export const CaptureSymbol = 'x';
export const CheckSymbol = '+';
export const CheckmateSymbol = '#';
export const CastleKingSide = 'O-O';
export const CastleQueenSide = 'O-O-O';

export type MoveNumber = string; // `${UpToTripleDigit}.`;
export type Comment = `{${string}}` | `;${string}`;

export const EmptyString = '';
export type EmptyString = typeof EmptyString;

export type CheckOrMateSuffix = EmptyString | typeof CheckSymbol | typeof CheckmateSymbol;
export type MoveTo = `${BoardFile}${BoardRank}`;
export type AmbiguousMoveFrom = EmptyString | BoardFile | `${BoardFile}${BoardRank}`

export type PawnMove = `${MoveTo}`;
export type PawnCapture = string; // `${BoardFile}${typeof CaptureSymbol}${MoveTo}${CheckOrMateSuffix}`;
export type PieceCapture = string; // `${PieceAsciiChar}${AmbiguousMoveFrom}${typeof CaptureSymbol}${MoveTo}${CheckOrMateSuffix}`;
export type PieceMove = string; // `${PieceAsciiChar}${AmbiguousMoveFrom}${MoveTo}${CheckOrMateSuffix}`;
export type PlayerMoveEntry = string; // typeof CastleKingSide | typeof CastleQueenSide | PawnMove | PawnCapture | PieceCapture | PieceMove;

// TODO: maybe we got too ambitious here
// TS2590: Expression produces a union type that is too complex to represent.
export type PgnEntry = string; // `${MoveNumber} ${PlayerMoveEntry} ${PlayerMoveEntry}${EmptyString | ` ${Comment}`}`;

export const CastleSideToPgnMap = {
  [CastleSide.KingSide]: CastleKingSide,
  [CastleSide.QueenSide]: CastleQueenSide,
} as const;

export type PGNData = {
  roster: {
    Event: InferValueFromTagPair<TagPairFormat.Event>,
    Site: InferValueFromTagPair<TagPairFormat.Site>,
    Date: InferValueFromTagPair<TagPairFormat.Date>,
    Round: InferValueFromTagPair<TagPairFormat.Round>,
    White: InferValueFromTagPair<TagPairFormat.White>,
    Black: InferValueFromTagPair<TagPairFormat.Black>,
    Result: InferValueFromTagPair<TagPairFormat.Result>,

    Annotator?: InferValueFromTagPair<TagPairFormat.Annotator>,
    PlyCount?: InferValueFromTagPair<TagPairFormat.PlyCount>,
    TimeControl?: InferValueFromTagPair<TagPairFormat.TimeControl>,
    Time?: InferValueFromTagPair<TagPairFormat.Time>,
    Termination?: InferValueFromTagPair<TagPairFormat.Termination>,
    Mode?: InferValueFromTagPair<TagPairFormat.Mode>,
    FEN?: InferValueFromTagPair<TagPairFormat.FEN>,
    SetUp?: InferValueFromTagPair<TagPairFormat.SetUp>,
  },
  moves: PgnMoveData[],
}

export type PgnMoveData = Partial<{
  moveNumber: number,
  whiteMoveData: Move,
  whiteComment: string,
  blackMoveData: Move,
  blackComment: string,
  comment: string,
}>;
