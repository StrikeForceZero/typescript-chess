export function removeErrorConstructorFromStackTrace<T extends Error>(instance: T): void {
  // Maintains proper stack trace for where our error was thrown (only available on V8)
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, instance.constructor);
  }
}
