import { describe, it, expect } from 'vitest';
import { formatResult, runFromInput } from './cliHelpers';
import { sampleInput } from './testFixtures';

describe('formatResult', () => {
  it('formats result without LOST when not lost', () => {
    expect(
      formatResult({
        position: { x: 1, y: 1 },
        orientation: 'E',
        lost: false,
      }),
    ).toBe('1 1 E');
  });

  it('appends LOST when lost', () => {
    expect(
      formatResult({
        position: { x: 3, y: 3 },
        orientation: 'N',
        lost: true,
      }),
    ).toBe('3 3 N LOST');
  });
});

describe('runFromInput', () => {
  it('returns sample output for sample input', () => {
    const out = runFromInput(sampleInput);
    expect(out).toBe('1 1 E\n3 3 N LOST\n2 3 S');
  });

  it('returns one line per robot', () => {
    const out = runFromInput('5 3\n0 0 N\n\n1 1 E\nFF');
    expect(out.split('\n')).toHaveLength(2);
    expect(out).toContain('0 0 N');
    expect(out).toContain('3 1 E'); // (1,1) E + FF -> (3,1) E
  });

  it('throws on invalid input', () => {
    expect(() => runFromInput('')).toThrow(/empty/);
    expect(() => runFromInput('not a grid')).toThrow();
  });
});
