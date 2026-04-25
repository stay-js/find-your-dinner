import { describe, expect, it } from 'vitest';

import {
  isCultureInvariantFloatString,
  isIntegerString,
  isNonNegativeIntegerString,
  isPositiveIntegerString,
  parseCultureInvariantFloat,
} from '~/lib/zod/helpers';
import { boolFlagSearchSchema, idArraySearchSchema } from '~/lib/zod/schemas';

describe('parseCultureInvariantFloat', () => {
  it('returns null for null', () => {
    expect(parseCultureInvariantFloat(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseCultureInvariantFloat(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseCultureInvariantFloat('')).toBeNull();
  });

  it('returns null for whitespace-only string', () => {
    expect(parseCultureInvariantFloat('   ')).toBeNull();
  });

  it('parses dot-separated float', () => {
    expect(parseCultureInvariantFloat('3.14')).toBe(3.14);
  });

  it('parses comma-separated float (culture-invariant)', () => {
    expect(parseCultureInvariantFloat('3,14')).toBe(3.14);
  });

  it('parses integer string', () => {
    expect(parseCultureInvariantFloat('42')).toBe(42);
  });

  it('parses negative float', () => {
    expect(parseCultureInvariantFloat('-1.5')).toBe(-1.5);
  });

  it('parses float with surrounding whitespace', () => {
    expect(parseCultureInvariantFloat('  2.5  ')).toBe(2.5);
  });

  it('returns NaN for non-numeric string', () => {
    expect(parseCultureInvariantFloat('abc')).toBeNaN();
  });
});

describe('isCultureInvariantFloatString', () => {
  it('returns true for dot-separated float', () => {
    expect(isCultureInvariantFloatString('3.14')).toBe(true);
  });

  it('returns true for comma-separated float', () => {
    expect(isCultureInvariantFloatString('3,14')).toBe(true);
  });

  it('returns true for integer string', () => {
    expect(isCultureInvariantFloatString('0')).toBe(true);
  });

  it('returns true for negative float string', () => {
    expect(isCultureInvariantFloatString('-1,5')).toBe(true);
  });

  it('returns false for non-numeric string', () => {
    expect(isCultureInvariantFloatString('abc')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isCultureInvariantFloatString('')).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(isCultureInvariantFloatString('   ')).toBe(false);
  });
});

describe('isIntegerString', () => {
  it('returns true for positive integer string', () => {
    expect(isIntegerString('5')).toBe(true);
  });

  it('returns true for zero', () => {
    expect(isIntegerString('0')).toBe(true);
  });

  it('returns true for negative integer string', () => {
    expect(isIntegerString('-3')).toBe(true);
  });

  it('returns false for float string', () => {
    expect(isIntegerString('1.5')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isIntegerString('')).toBe(false);
  });

  it('returns false for non-numeric string', () => {
    expect(isIntegerString('abc')).toBe(false);
  });
});

describe('isNonNegativeIntegerString', () => {
  it('returns true for zero', () => {
    expect(isNonNegativeIntegerString('0')).toBe(true);
  });

  it('returns true for positive integer', () => {
    expect(isNonNegativeIntegerString('10')).toBe(true);
  });

  it('returns false for negative integer', () => {
    expect(isNonNegativeIntegerString('-1')).toBe(false);
  });

  it('returns false for float string', () => {
    expect(isNonNegativeIntegerString('1.5')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isNonNegativeIntegerString('')).toBe(false);
  });

  it('returns false for non-numeric string', () => {
    expect(isNonNegativeIntegerString('abc')).toBe(false);
  });
});

describe('isPositiveIntegerString', () => {
  it('returns true for positive integer', () => {
    expect(isPositiveIntegerString('1')).toBe(true);
  });

  it('returns true for large positive integer', () => {
    expect(isPositiveIntegerString('999')).toBe(true);
  });

  it('returns false for zero', () => {
    expect(isPositiveIntegerString('0')).toBe(false);
  });

  it('returns false for negative integer', () => {
    expect(isPositiveIntegerString('-1')).toBe(false);
  });

  it('returns false for float string', () => {
    expect(isPositiveIntegerString('1.5')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isPositiveIntegerString('')).toBe(false);
  });

  it('returns false for non-numeric string', () => {
    expect(isPositiveIntegerString('abc')).toBe(false);
  });
});

describe('idArraySearchSchema', () => {
  it('parses valid JSON array of positive integers', () => {
    expect(idArraySearchSchema.parse('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('returns empty array for null', () => {
    expect(idArraySearchSchema.parse(null)).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(idArraySearchSchema.parse('')).toEqual([]);
  });

  it('returns empty array for invalid JSON', () => {
    expect(idArraySearchSchema.parse('not-json')).toEqual([]);
  });

  it('returns empty array for JSON with non-integer values', () => {
    expect(idArraySearchSchema.parse('[1.5, 2]')).toEqual([]);
  });

  it('returns empty array for JSON with negative integers', () => {
    expect(idArraySearchSchema.parse('[-1, 2]')).toEqual([]);
  });

  it('returns empty array for JSON array of strings', () => {
    expect(idArraySearchSchema.parse('["a","b"]')).toEqual([]);
  });

  it('returns empty array for a JSON non-array', () => {
    expect(idArraySearchSchema.parse('{"id":1}')).toEqual([]);
  });

  it('parses a single-element array', () => {
    expect(idArraySearchSchema.parse('[42]')).toEqual([42]);
  });
});

describe('boolFlagSearchSchema', () => {
  it('returns true for "1"', () => {
    expect(boolFlagSearchSchema.parse('1')).toBe(true);
  });

  it('returns true for "true"', () => {
    expect(boolFlagSearchSchema.parse('true')).toBe(true);
  });

  it('returns false for "0"', () => {
    expect(boolFlagSearchSchema.parse('0')).toBe(false);
  });

  it('returns false for "false"', () => {
    expect(boolFlagSearchSchema.parse('false')).toBe(false);
  });

  it('returns false for null', () => {
    expect(boolFlagSearchSchema.parse(null)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(boolFlagSearchSchema.parse('')).toBe(false);
  });

  it('returns false for arbitrary string', () => {
    expect(boolFlagSearchSchema.parse('yes')).toBe(false);
  });
});
