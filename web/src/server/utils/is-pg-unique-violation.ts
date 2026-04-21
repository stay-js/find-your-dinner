export function isPgUniqueViolation(err: unknown) {
  return (
    hasUniqueViolationCode(err) ||
    (typeof err === 'object' && err !== null && 'cause' in err && hasUniqueViolationCode(err.cause))
  );
}

function hasUniqueViolationCode(err: unknown) {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === '23505';
}
