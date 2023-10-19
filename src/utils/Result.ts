enum ResultType {
  Ok,
  Err,
}

export class Result<T, E> {
  private constructor(
    private readonly type: ResultType,
    private readonly data: { value?: T, error?: E },
  ) { }

  public static Ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(ResultType.Ok, { value });
  }

  public static Err<E>(error: E): Result<never, E> {
    return new Result<never, E>(ResultType.Err, { error });
  }

  public isOk(): this is Result<T, never> {
    return this.type === ResultType.Ok;
  }

  public isErr(): this is Result<never, E> {
    return this.type === ResultType.Err;
  }

  public unwrap(): T {
    if (this.isErr()) {
      throw new Error('Attempted to unwrap an Err value');
    }
    return this.data.value!;
  }

  public unwrapErr(): E {
    if (this.isOk()) {
      throw new Error('Attempted to unwrap an Ok value');
    }
    return this.data.error!;
  }
}
