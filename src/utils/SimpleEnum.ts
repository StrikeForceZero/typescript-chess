import { ValueOf } from 'type-fest';

export type SimpleEnum<T extends Record<K, V>, K extends PropertyKey, V> = T;
export type SimpleEnumTypeOf<T> = ValueOf<T>;

/**
 * `asSimpleEnum` is a utility function to create an enum-like object.
 * However, you may need to pass in `as const` to ensure the values are treated as literals.
 *
 * Example:
 * const MyEnum = asSimpleEnum({
 *   Zero: 0 as const,
 *   ONE: 1 as const,
 * });
 *
 * Usage:
 * type MyEnum = SimpleEnumTypeOf<typeof MyEnum>
 *
 * @template V - The type of the values in the enum object.
 * @template T - The type of the enum object, extending a record of string keys to values of type V.
 * @param {T} obj - The object to be returned as an enum.
 * @returns {T} - The input object returned as is.
 */
export function asSimpleEnum<T extends Record<K, V>, K extends PropertyKey, V>(obj: T): SimpleEnum<T, K, V> {
  return obj;
}

/**
 * `asSimpleConstEnum` is a utility function to create a enum-like object with
 * the `const` modifier ensuring that the values are treated as literals,
 * which could enable more precise type inference and immutability.
 *
 * Example:
 * const MyEnum = asSimpleConstEnum({
 *   Zero: 0,
 *   ONE: 1,
 * });
 *
 * Usage:
 * type MyEnum = SimpleEnumTypeOf<typeof MyEnum>
 *
 * @template V - The type of the values in the enum object, treated as literals due to the `const` modifier.
 * @template T - The type of the enum object, extending a record of string keys to values of type V.
 * @param {T} obj - The object to be returned as an enum.
 * @returns {T} - The input object returned as is, with the `const` modifier applied to the type parameter V.
 */
export function asSimpleConstEnum<const T extends Record<K, V>, const K extends PropertyKey, const V>(obj: T): SimpleEnum<T, K, V> {
  return obj;
}


