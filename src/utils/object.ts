export function getClassName(value: unknown): string | null {
  if (value && typeof value === 'object' && value.constructor && value.constructor.name) {
    return value.constructor.name;
  }
  return null;
}
