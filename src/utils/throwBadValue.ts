import { InvalidValueError } from './errors/InvalidValueError';

export function throwBadValue(value: unknown): never {
  throw new InvalidValueError(`Invalid value: ${value}`);
}
