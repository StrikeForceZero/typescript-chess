export function *zip<T, U>(arr1: readonly T[], arr2: readonly U[]): Generator<readonly [T | undefined, U | undefined]> {
  const minLength = Math.min(arr1.length, arr2.length);

  for (let i = 0; i < minLength; i++) {
    yield [arr1[i], arr2[i]];
  }
}

export function *zipExact<T, U>(arr1: readonly T[], arr2: readonly U[]): Generator<readonly [T, U]> {
  if (arr1.length !== arr2.length) {
    throw new Error('zipExact requires array lengths to be the same!');
  }

  for (let i = 0; i < arr1.length; i++) {
    yield [arr1[i] as T, arr2[i] as U];
  }
}
