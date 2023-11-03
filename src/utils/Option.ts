const None = Symbol('none');
type None = typeof None;

export type ValueOfOption<TOption> = TOption extends Option<infer TValue> ? TValue : unknown;

export interface SomeOption<T> {
  unwrap(): T;
}

export class Option<const T> {
  protected constructor(
    protected readonly value: T,
  ) { }

  public isNone(): this is Option<T> {
    return this.value === None;
  }

  public isSome(): this is Option<T> & SomeOption<T> {
    return this.value !== None;
  }

  protected unwrap(): T {
    if (this.value === None) {
      throw new Error('Attempted to unwrap None!');
    }
    return this.value;
  }

  public static Some<const T>(value: Exclude<T, None>): Option<T> {
    return new Option<T>(value);
  }

  public static None<const T>(): Option<T> {
    return new Option<T>(None as T);
  }
}
