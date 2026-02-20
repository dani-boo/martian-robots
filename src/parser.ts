/**
 * Parses Martian Robots input into a grid and a list of robots (each with start state + commands).
 *
 * How it works:
 * 1. Split the input into lines (toLines).
 * 2. Line 1 = grid bounds ("maxX maxY").
 * 3. Lines 2–3, 4–5, 6–7, … = one robot each: position line ("x y O") then command line ("LRF...").
 * 4. Small helpers (parseGrid, parsePosition, parseCommandString) turn each line into typed data; parseRobotInput combines one position line + one command line into a RobotInput. Invalid input throws with a clear message.
 */
import type { Grid, RobotState } from './types';
import { isOrientation } from './types';
import { COMMANDS, isCommand, type Command } from './movement';

export interface RobotInput {
  state: RobotState;
  commands: Command[];
}

export interface ParsedInput {
  grid: Grid;
  robots: RobotInput[];
}

/** Split on newline (\n or \r\n for Windows). Trim each line. Empty lines preserved (no whole-input trim). */
export const toLines = (input: string): string[] =>
  input.split(/\r?\n/).map((l) => l.trim());

/** Parse a string as integer; throws with clear message if not. */
export const parseIntStrict = (value: string, label: string, line: string): number => {
  const n = Number(value);
  if (Number.isNaN(n) || !Number.isInteger(n)) {
    throw new Error(`${label} must be an integer, got: ${value} (line: ${line})`);
  }
  return n;
};

/** First line of input: "maxX maxY" -> grid bounds. */
export const parseGrid = (line: string): Grid => {
  const parts = line.split(/\s+/);
  if (parts.length !== 2) throw new Error(`Expected "maxX maxY", got: ${line}`);
  return {
    maxX: parseIntStrict(parts[0], 'maxX', line),
    maxY: parseIntStrict(parts[1], 'maxY', line),
  };
};

/** One robot line: "x y O" -> position + orientation (N/S/E/W). */
export const parsePosition = (line: string): RobotState => {
  const parts = line.split(/\s+/);
  if (parts.length !== 3) throw new Error(`Expected "x y O", got: ${line}`);
  if (!isOrientation(parts[2])) {
    throw new Error(`Orientation must be N, S, E or W, got: ${parts[2]}`);
  }
  return {
    position: {
      x: parseIntStrict(parts[0], 'x', line),
      y: parseIntStrict(parts[1], 'y', line),
    },
    orientation: parts[2],
  };
};

/** Command line: string of L/R/F -> array of Command. */
export const parseCommandString = (line: string): Command[] => {
  const out: Command[] = [];
  for (const char of line) {
    if (!isCommand(char)) {
      throw new Error(`Invalid command "${char}". Use: ${COMMANDS.join(', ')}`);
    }
    out.push(char);
  }
  return out;
};

/** One robot: position line + command line -> RobotInput. */
export const parseRobotInput = (positionLine: string, commandLine: string): RobotInput => ({
  state: parsePosition(positionLine),
  commands: parseCommandString(commandLine),
});

/** Full input: line 1 = grid, then pairs (position, commands) per robot. */
export const parseInput = (input: string): ParsedInput => {
  const lines = toLines(input);
  if (lines.length === 0 || lines[0] === '') {
    throw new Error('Input is empty');
  }

  const grid = parseGrid(lines[0]);
  const robots: RobotInput[] = [];

  for (let i = 1; i < lines.length; i += 2) {
    const positionLine = lines[i];
    const commandLine = lines[i + 1];
    if (commandLine === undefined) {
      throw new Error(`Missing command line after: ${positionLine}`);
    }
    robots.push(parseRobotInput(positionLine, commandLine));
  }

  return { grid, robots };
};
