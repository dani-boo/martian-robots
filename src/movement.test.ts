import { describe, it, expect } from 'vitest';
import {
  COMMANDS,
  formatValidCommands,
  turnLeft,
  turnRight,
  forwardPosition,
  applyCommand,
} from './movement';

describe('COMMANDS', () => {
  it('exposes L, R, F', () => {
    expect(COMMANDS).toEqual(['L', 'R', 'F']);
  });
});

describe('formatValidCommands', () => {
  it('returns comma-separated valid commands', () => {
    expect(formatValidCommands()).toBe('L, R, F');
  });
});

describe('turnLeft', () => {
  it('rotates 90° left: N -> W -> S -> E -> N', () => {
    expect(turnLeft('N')).toBe('W');
    expect(turnLeft('W')).toBe('S');
    expect(turnLeft('S')).toBe('E');
    expect(turnLeft('E')).toBe('N');
  });
});

describe('turnRight', () => {
  it('rotates 90° right: N -> E -> S -> W -> N', () => {
    expect(turnRight('N')).toBe('E');
    expect(turnRight('E')).toBe('S');
    expect(turnRight('S')).toBe('W');
    expect(turnRight('W')).toBe('N');
  });
});

describe('forwardPosition', () => {
  it('moves one step in current orientation (N=+y, E=+x, S=-y, W=-x)', () => {
    expect(forwardPosition({ x: 1, y: 1 }, 'N')).toEqual({ x: 1, y: 2 });
    expect(forwardPosition({ x: 1, y: 1 }, 'E')).toEqual({ x: 2, y: 1 });
    expect(forwardPosition({ x: 1, y: 1 }, 'S')).toEqual({ x: 1, y: 0 });
    expect(forwardPosition({ x: 1, y: 1 }, 'W')).toEqual({ x: 0, y: 1 });
  });
});

describe('applyCommand', () => {
  const state = { position: { x: 2, y: 2 }, orientation: 'N' as const };

  it('L updates orientation only', () => {
    expect(applyCommand(state, 'L')).toEqual({
      position: { x: 2, y: 2 },
      orientation: 'W',
    });
  });

  it('R updates orientation only', () => {
    expect(applyCommand(state, 'R')).toEqual({
      position: { x: 2, y: 2 },
      orientation: 'E',
    });
  });

  it('F updates position only', () => {
    expect(applyCommand(state, 'F')).toEqual({
      position: { x: 2, y: 3 },
      orientation: 'N',
    });
  });

  it('throws for unknown command (exhaustiveness default)', () => {
    expect(() =>
      applyCommand(state, 'X' as Parameters<typeof applyCommand>[1]),
    ).toThrow(/Unknown command value/);
  });
});
