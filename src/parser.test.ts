import { describe, it, expect } from 'vitest';
import {
  toLines,
  parseIntStrict,
  parseGrid,
  parsePosition,
  parseCommandString,
  parseRobotInput,
  parseInput,
} from './parser';

/** Example input from tech test spec. */
const sampleInput = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;

/** Grid only; no robots. */
const gridOnlyInput = `5 3`;

/** One robot, no commands (missing command line). */
const singleRobotNoCommandsInput = `5 3
1 1 E`;

/** One robot, short command string. */
const singleRobotShortInput = `5 3
0 0 N
FF`;

/** Two robots, different orientations and short commands. */
const twoRobotsInput = `10 10
0 0 N
L
5 5 S
RR`;

describe('toLines', () => {
  it('splits on newline and trims each line (empty lines preserved)', () => {
    expect(toLines('  5 3  \n  1 1 E  \n')).toEqual(['5 3', '1 1 E', '']);
  });
  it('keeps empty lines in the middle', () => {
    expect(toLines('5 3\n\n1 1 E')).toEqual(['5 3', '', '1 1 E']);
  });
  it('handles Windows line endings (\\r\\n)', () => {
    expect(toLines('5 3\r\n1 1 E')).toEqual(['5 3', '1 1 E']);
  });
});

describe('parseGrid', () => {
  describe('valid input', () => {
    it('parses "maxX maxY" into grid bounds', () => {
      expect(parseGrid('5 3')).toEqual({ maxX: 5, maxY: 3 });
    });
  });
  describe('invalid input', () => {
    it('when not two parts', () => {
      expect(() => parseGrid('5')).toThrow(/Expected "maxX maxY"/);
      expect(() => parseGrid('5 3 1')).toThrow(/Expected "maxX maxY"/);
    });
    it('when parts are not integers', () => {
      expect(() => parseGrid('a b')).toThrow(/must be an integer/);
      expect(() => parseGrid('1.5 3')).toThrow(/must be an integer/);
    });
  });
});

describe('parseIntStrict', () => {
  describe('valid input', () => {
    it('returns integer for valid string', () => {
      expect(parseIntStrict('5', 'maxX', '5 3')).toBe(5);
    });
  });
  describe('invalid input', () => {
    it('throws for non-integer with label and line in message', () => {
      expect(() => parseIntStrict('x', 'maxX', 'x 3')).toThrow(/maxX must be an integer.*line: x 3/);
    });
  });
});

describe('parsePosition', () => {
  describe('valid input', () => {
    it('parses "x y O" into RobotState', () => {
      expect(parsePosition('1 1 E')).toEqual({
        position: { x: 1, y: 1 },
        orientation: 'E',
      });
    });
  });
  describe('invalid input throws', () => {
    it('when not three parts', () => {
      expect(() => parsePosition('1 1')).toThrow(/Expected "x y O"/);
    });
    it('when x or y is not an integer', () => {
      expect(() => parsePosition('1.5 1 E')).toThrow(/must be an integer/);
    });
    it('when orientation is invalid', () => {
      expect(() => parsePosition('1 1 X')).toThrow(/Orientation must be N, S, E or W/);
    });
  });
});

describe('parseCommandString', () => {
  describe('valid input', () => {
    it('parses L/R/F string into Command[]', () => {
      expect(parseCommandString('RFRF')).toEqual(['R', 'F', 'R', 'F']);
    });
    it('returns empty array for empty string', () => {
      expect(parseCommandString('')).toEqual([]);
    });
  });
  describe('invalid input', () => {
    it('throws on invalid character', () => {
      expect(() => parseCommandString('RFX')).toThrow(/Invalid command/);
    });
  });
});

describe('parseRobotInput', () => {
  it('combines position line and command line into RobotInput', () => {
    expect(parseRobotInput('1 1 E', 'RFRF')).toEqual({
      state: { position: { x: 1, y: 1 }, orientation: 'E' },
      commands: ['R', 'F', 'R', 'F'],
    });
  });
});

describe('parseInput', () => {
  describe('valid input', () => {
    it('parses sample input: grid + three robots', () => {
      const result = parseInput(sampleInput);
      expect(result.grid).toEqual({ maxX: 5, maxY: 3 });
      expect(result.robots).toHaveLength(3);
      expect(result.robots[0]).toEqual({
        state: { position: { x: 1, y: 1 }, orientation: 'E' },
        commands: ['R', 'F', 'R', 'F', 'R', 'F', 'R', 'F'],
      });
      expect(result.robots[1].state).toEqual({
        position: { x: 3, y: 2 },
        orientation: 'N',
      });
      expect(result.robots[1].commands).toEqual([
        'F', 'R', 'R', 'F', 'L', 'L', 'F', 'F', 'R', 'R', 'F', 'L', 'L',
      ]);
      expect(result.robots[2].state).toEqual({
        position: { x: 0, y: 3 },
        orientation: 'W',
      });
    });

    it('parses grid only (no robots)', () => {
      const result = parseInput(gridOnlyInput);
      expect(result.grid).toEqual({ maxX: 5, maxY: 3 });
      expect(result.robots).toHaveLength(0);
    });

    it('parses single robot with short commands', () => {
      const result = parseInput(singleRobotShortInput);
      expect(result.grid).toEqual({ maxX: 5, maxY: 3 });
      expect(result.robots).toHaveLength(1);
      expect(result.robots[0].state).toEqual({
        position: { x: 0, y: 0 },
        orientation: 'N',
      });
      expect(result.robots[0].commands).toEqual(['F', 'F']);
    });

    it('parses two robots with different orientations', () => {
      const result = parseInput(twoRobotsInput);
      expect(result.grid).toEqual({ maxX: 10, maxY: 10 });
      expect(result.robots).toHaveLength(2);
      expect(result.robots[0].state.orientation).toBe('N');
      expect(result.robots[0].commands).toEqual(['L']);
      expect(result.robots[1].state.orientation).toBe('S');
      expect(result.robots[1].commands).toEqual(['R', 'R']);
    });
  });

  describe('invalid input throws', () => {
    it('on empty input', () => {
      expect(() => parseInput('')).toThrow(/empty/);
      expect(() => parseInput('   \n  \n')).toThrow(/empty/);
    });

    it('when command line is missing after position line', () => {
      expect(() => parseInput(singleRobotNoCommandsInput)).toThrow(/Missing command line after/);
    });

    it('when grid line does not have two numbers', () => {
      expect(() => parseInput('5\n1 1 E\nFF')).toThrow(/Expected "maxX maxY"/);
      expect(() => parseInput('5 3 1\n1 1 E\nFF')).toThrow(/Expected "maxX maxY"/);
    });

    it('when position line does not have x y O', () => {
      expect(() => parseInput('5 3\n1 1\nFF')).toThrow(/Expected "x y O"/);
      expect(() => parseInput('5 3\n1 E\nFF')).toThrow(/Expected "x y O"/);
    });

    it('when orientation is invalid', () => {
      expect(() => parseInput('5 3\n1 1 X\nFF')).toThrow(/Orientation must be N, S, E or W/);
    });

    it('when command string contains invalid character', () => {
      expect(() => parseInput('5 3\n1 1 E\nRFX')).toThrow(/Invalid command/);
    });
  });
});
