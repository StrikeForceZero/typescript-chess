enum ResultType {
  Ok,
  Err,
}

type EitherResult<T, E> = Result<T, never> | Result<never, E>;

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

  /**
   * returns the lowest possible Result.Ok or first Result.Err
   * @param valueOrErrorOrResult
   * @param hasError
   * @private
   */
  private static flattenAndWrap<T, E>(valueOrErrorOrResult: T , hasError: false): Result<T, E & never>;
  private static flattenAndWrap<T, E>(valueOrErrorOrResult: E , hasError: true): Result<T & never, E>;
  private static flattenAndWrap<T, E>(valueOrErrorOrResult: T | E , hasError?: boolean): EitherResult<T, E>;
  private static flattenAndWrap<T, E>(valueOrErrorOrResult: T | E, hasError = false): EitherResult<T, E> {
    if (valueOrErrorOrResult instanceof Result) {
      if (valueOrErrorOrResult.isErr()) {
        return Result.flattenAndWrap(valueOrErrorOrResult.unwrapErr(), true);
      }
      if (valueOrErrorOrResult.isOk()) {
        return Result.flattenAndWrap(valueOrErrorOrResult.unwrap(), hasError);
      }
    }
    if (hasError) {
      return Result.Err(valueOrErrorOrResult as E);
    }
    return Result.Ok(valueOrErrorOrResult as T);
  }

  /**
   * if the tryFn throws the result will be Result.Err, but if it returns Result, it will be nested Result.Ok(EitherResult)
   * @param tryFn
   */
  public static capture<T>(tryFn: () => T): EitherResult<T, unknown> {
    try {
      return Result.Ok(tryFn());
    }
    catch (err) {
      return Result.Err(err);
    }
  }

  /**
   * regardless if the tryFn throws the result will never be a nested Result
   * @param tryFn
   */
  public static captureFlatten<T>(tryFn: () => T): EitherResult<T, unknown> {
    try {
      const result = tryFn();
      return Result.flattenAndWrap(result);
    }
    catch (err) {
      return Result.flattenAndWrap(err, true);
    }
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
