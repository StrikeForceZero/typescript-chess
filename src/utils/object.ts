import { ValueOf } from 'type-fest';

export function getClassName(value: unknown): string | null {
  if (value && typeof value === 'object' && value.constructor && value.constructor.name) {
    return value.constructor.name;
  }
  return null;
}

export function entries<T extends Record<string, unknown>>(obj: T): [keyof T, ValueOf<T>][] {
  return Object.entries(obj) as [keyof T, ValueOf<T>][];
}
