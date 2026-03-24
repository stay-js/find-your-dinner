export function isPgUniqueViolation(
  err: unknown,
): err is { code: string; constraint?: string; detail?: string } {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === '23505';
}
