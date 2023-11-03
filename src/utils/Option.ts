const None = Symbol('none');
type None = typeof None;

export type ValueOfOption<TOption> = TOption extends Option<infer TValue> ? TValue : unknown;

export interface OptionHasValue<T> {
  readonly value: T;
}

export interface OptionHasNone {
  // this doesn't work as desired but at least remaps the value from T to unknown
  unwrap(): never;
}

export class Option<const T> {
  protected constructor(
    protected readonly value: T,
  ) { }

  public isNone(): this is OptionHasNone {
    return this.value === None;
  }

  public isSome(): this is Option<T> & OptionHasValue<T> {
    return this.value !== None;
  }

  public unwrap(): T {
    if (this.value === None) {
      throw new Error('Attempted to unwrap None!');
    }
    return this.value;
  }

  // includes None
  public isValueEqual(other: Option<T>): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.isSome() ? `Some(${JSON.stringify(this.value)})` : 'None';
  }

  public toJSON() {
    return { type: this.isSome() ? 'some' : 'none', value: this.value };
  }

  public static Some<const T>(value: Exclude<T, None>): Option<T> {
    return new Option<T>(value);
  }

  public static None<const T>(): Option<T> {
    return new Option<T>(None as T);
  }
}
