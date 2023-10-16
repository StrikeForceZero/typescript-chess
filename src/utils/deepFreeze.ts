import { ReadonlyDeep } from 'type-fest';

export function deepFreeze<T>(obj: T): ReadonlyDeep<T> {
  const propNames = Object.getOwnPropertyNames(obj);

  for (const name of propNames as (keyof typeof obj)[]) {
    const value = obj[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj) as ReadonlyDeep<T>;
}
