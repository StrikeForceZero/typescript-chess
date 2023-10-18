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
    }, { } as Record<K, number>);
}

export function groupBy<T, K extends PropertyKey>(arr: readonly T[], keyMapper: (value: T, index: number, arr: readonly T[]) => K): Record<K, T[]> {
    return arr.reduce<Record<K, T[]>>((counterMap, item, index, arr) => {
        const key = keyMapper(item, index, arr);
        counterMap[key] = (counterMap[key] ?? []);
        counterMap[key].push(item);
        return counterMap;
    }, { } as Record<K, T[]>);
}

export function groupByMapped<T, K extends PropertyKey, V>(arr: readonly T[], keyValueMapper: (value: T, index: number, arr: readonly T[]) => readonly [key: K, value: V]): Record<K, V[]> {
    return arr.reduce<Record<K, V[]>>((counterMap, item, index, arr) => {
        const [key, value] = keyValueMapper(item, index, arr);
        counterMap[key] = (counterMap[key] ?? []);
        counterMap[key].push(value);
        return counterMap;
    }, { } as Record<K, V[]>);
}
