export function ensureArray<T>(value: T | readonly T[]): readonly T[];
export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}


type NotEmptyArray<T> = [T, ...T[]];

export function isNotEmpty<T>(arr: readonly T[]): arr is NotEmptyArray<T> {
  return arr.length > 0;
}

export function last<T>(arr: NotEmptyArray<T>): T;
export function last<T>(arr: readonly T[]): T | undefined;
export function last<T>(arr: readonly T[]): T | undefined {
  return arr[arr.length - 1];
}

export function lastOrThrow<T>(arr: readonly T[]): T {
  if (isNotEmpty(arr)) {
    return last(arr)!;
  }
  throw new Error('array was empty!');
}

export function sum(arr: readonly number[]): number {
  return arr.reduce((left, right) => left + right);
}
