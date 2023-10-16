import {
  ReadonlyDeep,
  ValueOf,
} from 'type-fest';
import { deepFreeze } from './deepFreeze';

type Variant<T, U> = U & { kind: T };
type TaggedEnum<T> = {
  [K in keyof T]: Variant<K, T[K]>;
};

export type TaggedEnumTypeOf<T> = ValueOf<T>;

/**
 * Creates a tagged enum from a provided definition object.
 *
 * A tagged enum is an object where each property is a distinct variant
 * of the enum. Each variant has a `kind` property which acts as a tag
 * indicating its type.
 *
 * This utility function ensures that the returned enum is deeply read-only
 * and each variant is correctly tagged with its type.
 *
 * ## Example:
 * ```typescript
 * const Thing = createTaggedEnum({
 *   Something: { something: 1 },
 *   OtherThing: { somethingElse: 2 },
 * });
 * type Thing = TaggedEnumTypeOf<typeof Thing>;
 *
 * // Using the enum in a switch-case:
 * function returnValue(thing: Thing): number {
 *   switch (thing) {
 *     case Thing.Something:
 *       return thing.something;
 *     case Thing.OtherThing:
 *       return thing.somethingElse;
 *     default: throw new Error(`unknown thing ${thing.kind}`);
 *   }
 * }
 *
 * or
 *
 * // Using the enum in a switch-case:
 * function returnValue(thing: Thing): number {
 *   switch (thing.kind) {
 *     case Thing.Something.kind:
 *       return thing.something;
 *     case Thing.OtherThing.kind:
 *       return thing.somethingElse;
 *     default: throw new Error(`unknown thing ${thing.kind}`);
 *   }
 * }
 * ```
 *
 * @template T - The type of the definition object, extending a record of string keys
 *               to records of string keys to unknown values.
 * @param {T} defs - The definition object based on which the tagged enum is created.
 * @returns {TaggedEnum<T>} - The created tagged enum with variants.
 */
export function createTaggedEnum<const T extends Record<string, ReadonlyDeep<Record<string, unknown>>>>(defs: T): ReadonlyDeep<TaggedEnum<T>> {
  const result: Partial<TaggedEnum<T>> = {};

  for (const key of Object.keys(defs) as (keyof T)[]) {
    result[key] = (
      {
        ...defs[key],
        kind: key,
      } satisfies Variant<typeof key, T[typeof key]>
    );
  }

  return deepFreeze(result as TaggedEnum<T>);
}

