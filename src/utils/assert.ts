import { AssertNeverError } from './errors/AssertNeverError';
import { NotExhaustiveOrInvalidValueError } from './errors/NotExhaustiveOrInvalidValueError';

// Externally-visible signature
export function assertNever(message?: never): never;
// Implementation signature
export function assertNever(message?: string): void {
  throw new AssertNeverError(message);
}

// Externally-visible signature
export function assertExhaustive(value: never, message?: string): never;
// Implementation signature
export function assertExhaustive(value: unknown, message?: string): void {
  throw new NotExhaustiveOrInvalidValueError(value, message);
}

export function impossible(message: string = 'impossible'): never {
  throw new AssertNeverError(message);
}
