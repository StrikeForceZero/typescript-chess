type VariantConstructor<T, U> = (args: U) => U & { kind: T };
type TaggedEnum<T> = {
  [K in keyof T]: VariantConstructor<K, T[K]> & { readonly KIND: K };
};

/**
 * `TaggedEnumTypeOf` is a utility type to extract the return type of the functions within an object type.
 * This assists in creating tagged union types, often used for discriminated unions.
 *
 * Usage example:
 *
 *     const Shape = createTaggedEnum({
 *       Square: { sides: 0 },
 *       Circle: { radius: 0 },
 *     });
 *     type Shape = TaggedEnumTypeOf<typeof Shape>;
 *
 *     function returnValue(shape: Shape): number {
 *       switch (shape.kind) {
 *         case Shape.Circle.KIND:
 *           return shape.radius;
 *         case Shape.Square.KIND:
 *           return shape.sides;
 *       }
 *     }
 * It employs `never` and `unknown` to avoid using explicit `any`, adhering to eslint's @typescript-eslint/no-explicit-any rule.
 */
export type TaggedEnumTypeOf<T> = ReturnType<Extract<T[keyof T], (...args: never[]) => unknown>>;
// Alternative (more direct but less generic): ReturnType<typeof SomeSpecificEnum[keyof typeof SomeSpecificEnum]>

/**
 * The `createTaggedEnum` function is a utility function to create a tagged enum
 * based on the provided definition object. A tagged enum is an object whose
 * properties are functions that return a variant of the enum, with each variant
 * having a `kind` property indicating the variant type.
 *
 * Each variant constructor function also has a `KIND` property with the same
 * value as the `kind` property of the variant objects it creates.
 *
 * Example Usage:
 * ```typescript
 * const Shape = createTaggedEnum({
 *   Square: { sides: 4 },
 *   Circle: { radius: 0 },
 * });
 * type Shape = TaggedEnumTypeOf<typeof Shape>;
 *
 * function returnValue(shape: Shape): number {
 *   switch (shape.kind) {
 *     case Shape.Circle.KIND:
 *       return shape.radius;
 *     case Shape.Square.KIND:
 *       return shape.sides;
 *   }
 * }
 * ```
 *
 * @template T - The type of the definition object, extending a record of string keys
 *               to records of string keys to unknown values.
 * @param {T} defs - The definition object based on which the tagged enum is created.
 * @returns {TaggedEnum<T>} - The created tagged enum with variant constructor functions.
 */
export function createTaggedEnum<T extends Record<string, Record<string, unknown>>>(defs: T): TaggedEnum<T> {
  const result: Partial<TaggedEnum<T>> = {};

  for (const key of Object.keys(defs) as (keyof T)[]) {
    const variant = (args: T[typeof key]) => ({ ...args, kind: key });
    variant.KIND = key;
    result[key] = variant;
  }

  return result as TaggedEnum<T>;
}
