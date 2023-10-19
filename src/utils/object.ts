import { ValueOf } from 'type-fest';
import { argsToArray } from './array';

export function getClassName(value: unknown): string | null {
  if (value && typeof value === 'object' && value.constructor && value.constructor.name) {
    return value.constructor.name;
  }
  return null;
}

export function entries<T extends Record<string, unknown>>(obj: T): [keyof T, ValueOf<T>][] {
  return Object.entries(obj) as [keyof T, ValueOf<T>][];
}

export function omit<T, K extends keyof T>(obj: T, ...keys: readonly  [K, ...K[]]): Omit<T, K>;
export function omit<T, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K>;
export function omit<T, K extends keyof T>(obj: T, ...keysOrArray: readonly K[]): Omit<T, K> {
  const keys = argsToArray(keysOrArray);
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
