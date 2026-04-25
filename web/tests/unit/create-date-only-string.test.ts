import { describe, expect, it } from 'vitest';

import { createDateOnlyString } from '~/lib/create-date-only-string';

describe('createDateOnlyString', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(createDateOnlyString(new Date(2024, 0, 15))).toBe('2024-01-15');
  });

  it('pads single-digit month and day with zeros', () => {
    expect(createDateOnlyString(new Date(2024, 2, 5))).toBe('2024-03-05');
  });

  it('handles December 31', () => {
    expect(createDateOnlyString(new Date(2023, 11, 31))).toBe('2023-12-31');
  });

  it('handles January 1', () => {
    expect(createDateOnlyString(new Date(2000, 0, 1))).toBe('2000-01-01');
  });
});
