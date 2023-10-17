// TODO: virtually useless

/**
 * Creates a const tagged enum factory based on the type provided to the generic param that maintains the values passed into the variant constructors
 *
 * ## Example usage:
 * type TParamExtends = number;
 * const foo = constTaggedEnumFactory<TParamExtends>()({
 *   Bar: _ => _,
 *   Foo: _ => _,
 * });
 * const bar = foo.Bar(1); // {readonly value: 1, readonly kind: "Bar"}
 * const barValue: 1 = bar.value; // should not error
 */

export function constTaggedEnumFactory<const TParamExtends>() {
  type VariantConstructorDef = <const TParam extends TParamExtends>(arg: TParam) => TParam;

  type VariantConstructor<Key> = <const TParam extends TParamExtends>(arg: TParam) => { readonly value: TParam, readonly kind: Key }
  type Remapped<T> = {
    [Key in keyof T]: VariantConstructor<Key> & { readonly KIND: Key }
  }

  return <const Def extends Record<string, VariantConstructorDef>>(
    def: Def
  ): Remapped<Def> => {
    const result: Partial<Remapped<Def>> = {};

    for (const [key, fn] of Object.entries(def) as ([keyof Def, Def[keyof Def]])[]) {
      const variant = <const TParam extends TParamExtends>(arg: TParam): ReturnType<VariantConstructor<typeof key>> => ({ value: fn(arg), kind: key });
      variant.KIND = key;
      result[key] = variant;
    }

    return result as Remapped<Def>;
  };
}
