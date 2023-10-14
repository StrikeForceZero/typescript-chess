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
  North = 'north',
  NorthEast = 'north-east',
  East = 'east',
  SouthEast = 'south-east',
  South = 'south',
  SouthWest = 'south-west',
  West = 'west',
  NorthWest = 'north-west',
}

export type AnyDirection = Direction | SimpleDirection | DiagonalDirection;
