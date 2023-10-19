export enum SimpleDirection {
  North = 'north',
  East = 'east',
  South = 'south',
  West = 'west',
}

export enum DiagonalDirection {
  NorthEast = 'north-east',
  SouthEast = 'south-east',
  SouthWest = 'south-west',
  NorthWest = 'north-west',
}

export enum Direction {
  North = SimpleDirection.North,
  NorthEast = DiagonalDirection.NorthEast,
  East = SimpleDirection.East,
  SouthEast = DiagonalDirection.SouthEast,
  South = SimpleDirection.South,
  SouthWest = DiagonalDirection.SouthWest,
  West = SimpleDirection.West,
  NorthWest = DiagonalDirection.NorthWest,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AnySimpleDirection {
  export type North = SimpleDirection.North | Direction.North;
  export type East = SimpleDirection.East | Direction.East;
  export type South = SimpleDirection.South | Direction.South;
  export type West = SimpleDirection.West | Direction.West;
}
export type AnySimpleDirection =
  AnySimpleDirection.North
  | AnySimpleDirection.East
  | AnySimpleDirection.South
  | AnySimpleDirection.West;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AnyDiagonalDirection {
  export type NorthEast = DiagonalDirection.NorthEast | Direction.NorthEast;
  export type SouthEast = DiagonalDirection.SouthEast | Direction.SouthEast;
  export type SouthWest = DiagonalDirection.SouthWest | Direction.SouthWest;
  export type NorthWest = DiagonalDirection.NorthWest | Direction.NorthWest;
}
export type AnyDiagonalDirection =
  AnyDiagonalDirection.NorthEast
  | AnyDiagonalDirection.SouthEast
  | AnyDiagonalDirection.SouthWest
  | AnyDiagonalDirection.NorthWest;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AnyDirection {
  export type North = AnySimpleDirection.North;
  export type East = AnySimpleDirection.East;
  export type South = AnySimpleDirection.South;
  export type West = AnySimpleDirection.West;
  export type NorthEast = AnyDiagonalDirection.NorthEast;
  export type SouthEast = AnyDiagonalDirection.SouthEast;
  export type SouthWest = AnyDiagonalDirection.SouthWest;
  export type NorthWest = AnyDiagonalDirection.NorthWest;
}
export type AnyDirection = AnySimpleDirection | AnyDiagonalDirection;

export type ToDirection<T extends AnyDirection> =
    T extends AnyDirection.North ? Direction.North
  : T extends AnyDirection.East ? Direction.East
  : T extends AnyDirection.South ? Direction.South
  : T extends AnyDirection.West ? Direction.West
  : T extends AnyDirection.NorthEast ? Direction.NorthEast
  : T extends AnyDirection.SouthEast ? Direction.SouthEast
  : T extends AnyDirection.SouthWest ? Direction.SouthWest
  : T extends AnyDirection.NorthWest ? Direction.NorthWest
  : never;
// This utility type turns an array or tuple of AnyDirection values into their corresponding Direction values
export type ToDirectionArray<T extends readonly AnyDirection[]> = {
  [K in keyof T]: ToDirection<T[K]>;
};

export function toDirection<T extends readonly AnyDirection[]>(directions: T): ToDirectionArray<T>;
export function toDirection<T extends AnyDirection>(direction: T): ToDirection<T>;
export function toDirection(direction: AnyDirection | AnyDirection[]): unknown {
  return direction;
}
