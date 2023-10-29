export function ensureArray<T>(value: T | readonly T[]): readonly T[];
export function ensureArray<T>(value: T | T[]): T[] {
  return isArray(value) ? value : [value];
}

export function isArray<T>(arr: T | T[]): arr is T[] {
  return Array.isArray(arr);
}

export function argsToArray(args: readonly [unknown[], unknown, ...unknown[]]): never;
export function argsToArray<T>(args: readonly T[]): T[];
export function argsToArray<T>(args: readonly T[]): T[] {
  if (args.length >= 2) {
    if (isArray(args[0])) {
      throw new Error('first param in args as array is not supported');
    }
  }
  if (!isNotEmpty(args)) {
    return [];
  }
  const firstElement = first(args);
  return isArray(firstElement) ? firstElement : args;
}

export type EmptyArray<T> = { length: 0; [index: number]: T };

export function isEmpty<T>(arr: Readonly<ArrayLike<T>>): arr is Readonly<EmptyArray<T>>;
export function isEmpty<T>(arr: ArrayLike<T>): arr is EmptyArray<T>;
export function isEmpty<T>(arr: ArrayLike<T>): arr is EmptyArray<T> {
  return arr.length === 0;
}

export type NotEmptyArray<T> = [T, ...T[]];

export function isNotEmpty<T>(arr: readonly T[]): arr is NotEmptyArray<T> {
  return arr.length > 0;
}

export function first<T>(arr: NotEmptyArray<T>): T;
export function first<T>(arr: readonly T[]): T | undefined;
export function first<T>(arr: readonly T[]): T | undefined {
  return arr[0];
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

export function sumBy<T>(arr: readonly T[], predicate: (value: T, index: number, arr: readonly T[]) => number): number {
  return arr.reduce((counter, item, index, arr) => counter + predicate(item, index, arr), 0);
}

export function count<T>(arr: readonly T[], predicate: (value: T, index: number, arr: readonly T[]) => boolean): number {
  return sumBy(arr, (...args) => Number(predicate(...args)));
}

export function tallyBy<T, K extends PropertyKey>(arr: readonly T[], keyMapper: (value: T, index: number, arr: readonly T[]) => K): Record<K, number> {
  return arr.reduce<Record<K, number>>((counterMap, item, index, arr) => {
    const key = keyMapper(item, index, arr);
    counterMap[key] = (counterMap[key] ?? 0) + 1;
    return counterMap;
  }, {} as Record<K, number>);
}

export function groupBy<T, K extends PropertyKey>(arr: readonly T[], keyMapper: (value: T, index: number, arr: readonly T[]) => K): Record<K, T[]> {
  return arr.reduce<Record<K, T[]>>((counterMap, item, index, arr) => {
    const key = keyMapper(item, index, arr);
    counterMap[key] = (counterMap[key] ?? []);
    counterMap[key].push(item);
    return counterMap;
  }, {} as Record<K, T[]>);
}

export function groupByMapped<T, K extends PropertyKey, V>(
  arr: readonly T[],
  keyValueMapper: (value: T, index: number, arr: readonly T[]) => readonly [key: K, value: V],
): Record<K, V[]> {
  return arr.reduce<Record<K, V[]>>((counterMap, item, index, arr) => {
    const [key, value] = keyValueMapper(item, index, arr);
    counterMap[key] = (counterMap[key] ?? []);
    counterMap[key].push(value);
    return counterMap;
  }, {} as Record<K, V[]>);
}

export function getRandomItem<T>(array: NotEmptyArray<T>): T;
export function getRandomItem<T>(array: T[]): T | undefined;
export function getRandomItem<T>(array: readonly T[]): T | undefined;
export function getRandomItem<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
