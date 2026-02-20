import { describe, it, expect } from 'vitest';
import { isInBounds, scentKey } from './types';

describe('scentKey', () => {
  it('includes position and orientation (cell + facing direction)', () => {
    expect(scentKey({ x: 1, y: 2 }, 'N')).toBe('1,2,N');
    expect(scentKey({ x: 0, y: 0 }, 'W')).toBe('0,0,W');
  });
});

describe('isInBounds', () => {
  const grid = { maxX: 5, maxY: 3 };

  it('returns true when point is inside grid (x in [0,maxX], y in [0,maxY])', () => {
    expect(isInBounds(grid, { x: 0, y: 0 })).toBe(true);
    expect(isInBounds(grid, { x: 5, y: 3 })).toBe(true);
    expect(isInBounds(grid, { x: 2, y: 1 })).toBe(true);
  });

  it('returns false when x is outside [0, maxX]', () => {
    expect(isInBounds(grid, { x: -1, y: 0 })).toBe(false);
    expect(isInBounds(grid, { x: 6, y: 0 })).toBe(false);
  });

  it('returns false when y is outside [0, maxY]', () => {
    expect(isInBounds(grid, { x: 0, y: -1 })).toBe(false);
    expect(isInBounds(grid, { x: 0, y: 4 })).toBe(false);
  });
});
