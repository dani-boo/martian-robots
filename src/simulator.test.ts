import { describe, it, expect } from 'vitest';
import { parseInput } from './parser';
import { runSimulation } from './simulator';
import { sampleInput } from './testFixtures';

describe('runSimulation', () => {
  describe('valid input', () => {
    it('matches sample output: robot 1 stays, robot 2 LOST, robot 3 ends at 2 3 S', () => {
      const parsed = parseInput(sampleInput);
      const results = runSimulation(parsed);
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({
        position: { x: 1, y: 1 },
        orientation: 'E',
        lost: false,
      });
      expect(results[1]).toEqual({
        position: { x: 3, y: 3 },
        orientation: 'N',
        lost: true,
      });
      expect(results[2]).toEqual({
        position: { x: 2, y: 3 },
        orientation: 'S',
        lost: false,
      });
    });

    it('robot with no commands stays at start and is not lost', () => {
      const parsed = parseInput('5 3\n0 0 N\n');
      const results = runSimulation(parsed);
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        position: { x: 0, y: 0 },
        orientation: 'N',
        lost: false,
      });
    });

    it('L and R only do not change position', () => {
      const parsed = parseInput('5 3\n1 1 E\nLR');
      const results = runSimulation(parsed);
      expect(results[0].position).toEqual({ x: 1, y: 1 });
      expect(results[0].lost).toBe(false);
    });
  });

  describe('scent behaviour', () => {
    it('second robot skips F when it would fall off from a scented cell', () => {
      // Grid 1x0: only (0,0) and (1,0). Robot 1 at (1,0) E moves F -> lost, scent at (1,0,E).
      // Robot 2 at (1,0) E tries F -> would fall off, cell is scented -> skip, stay at (1,0) E.
      const parsed = parseInput(`1 0
1 0 E
F
1 0 E
F`);
      const results = runSimulation(parsed);
      expect(results[0]).toEqual({
        position: { x: 1, y: 0 },
        orientation: 'E',
        lost: true,
      });
      expect(results[1]).toEqual({
        position: { x: 1, y: 0 },
        orientation: 'E',
        lost: false,
      });
    });
  });
});
