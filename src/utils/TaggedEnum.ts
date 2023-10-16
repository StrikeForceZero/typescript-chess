import { ReadonlyDeep } from 'type-fest';
import { deepFreeze } from './deepFreeze';

type VariantConstructor<T, U, R> = (args: U) => { value: R, kind: T };
type ExtractSingleParameter<T> = T extends (arg1: infer P, ...args: never[]) => unknown ? P : never;
type TaggedEnum<T extends Record<string, TypeFn<P, R>>, P, R> = {
  [K in keyof T]: VariantConstructor<K, ExtractSingleParameter<T[K]>, ReturnType<T[K]>> & { readonly KIND: K };
};
type TypeFn<Params, Return> = (_: Params) => Return;

export type TaggedEnumTypeOf<T> = ReturnType<Extract<T[keyof T], (...args: never[]) => unknown>>;

/**
 * Creates a tagged enum based on the provided definition object.
 *
 * A tagged enum is a higher-order type that maps keys to variant constructor functions.
 * Each constructed variant contains a `kind` property indicating its type and a `value`
 * property holding the actual data of the variant.
 *
 * Each variant constructor function is also equipped with a `KIND` property that
 * mirrors the `kind` value of the objects it creates. This facilitates type-safe
 * switching on variants.
 *
 * ## Example:
 *
 * ```typescript
 * export const Shape = createTaggedEnum({
 *   Square: (_: { sides: number }) => _,
 *   Circle: (_: { radius: number }) => _,
 *   Foo: (_: { a: number }) => ({ ..._, b: 1, c: 2 } as const),
 *   Number: (_: number) => _,
 *   Empty: (_: Record<string, never>) => undefined,
 * });
 * type Shape = TaggedEnumTypeOf<typeof Shape>;
 *
 * function foo(shape: Shape): number {
 *   switch (shape.kind) {
 *     case Shape.Circle.KIND:
 *       return shape.value.radius;
 *     case Shape.Square.KIND:
 *       return shape.value.sides;
 *     default:
 *       throw new Error(`unknown shape ${shape.kind}`);
 *   }
 * }
 *
 * const shape = Shape.Circle({ radius: 5 });
 *
 * foo(shape) // 5
 * ```
 *
 * @template T - The inferred type of the definition object, mapping string keys to type functions.
 * @template P - The inferred parameter type for the type function.
 * @template R - The inferred return type for the type function.
 *
 * @param {T} defs - The definition object based on which the tagged enum is created.
 * @returns {TaggedEnum<T, P, R>} - The created tagged enum with variant constructor functions.
 */
// TODO: how can we preserve the constant values passed through?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTaggedEnum<T extends ReadonlyDeep<Record<string, TypeFn<P, R>>>, P = any, R = any>(defs: T): ReadonlyDeep<TaggedEnum<T, P, R>> {
  const result: Partial<TaggedEnum<T, P, R>> = {};

  for (const key of Object.keys(defs) as (keyof T)[]) {
    const variantDefaultFn = defs[key] as TypeFn<ExtractSingleParameter<T[typeof key]>, ReturnType<T[typeof key]>>;
    const variant = (args: ExtractSingleParameter<T[typeof key]>) => ({
      value: variantDefaultFn(args),
      kind: key,
    });
    variant.KIND = key;
    result[key] = variant;
  }

  return deepFreeze(result as TaggedEnum<T, P, R>);
}
