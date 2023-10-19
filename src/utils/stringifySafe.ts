export function stringifySafe(value: unknown) {
  try {
    return JSON.stringify(value);
  }
  catch (e) {
    return String(value);
  }
}
