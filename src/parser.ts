/**
 * Parses Martian Robots input into a grid and a list of robots (each with start state + commands).
 *
 * How it works:
 * 1. Split the input into lines (toLines).
 * 2. Line 1 = grid bounds ("maxX maxY").
 * 3. Lines 2–3, 4–5, 6–7, … = one robot each: position line ("x y O") then command line ("LRF...").
 * 4. Small helpers (parseGrid, parsePosition, parseCommandString) turn each line into typed data; parseRobotInput combines one position line + one command line into a RobotInput. Invalid input throws with a clear message.
 * 5. Tech spec limits: max coordinate 50, instruction string length ≤ 100.
 */
import type { Grid, RobotState } from './types';
import { isOrientation } from './types';
import { COMMANDS, isCommand, type Command } from './movement';

const MAX_COORD = 50;
const MAX_INSTRUCTION_LENGTH = 100;

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
  if (parts.length !== 2) {
    throw new Error(
      `First line must be the grid size: two numbers for max X and max Y (e.g. 5 3). Got: ${line}`,
    );
  }
  const maxX = parseIntStrict(parts[0], 'maxX', line);
  const maxY = parseIntStrict(parts[1], 'maxY', line);
  if (maxX > MAX_COORD || maxY > MAX_COORD) {
    throw new Error(
      `Grid size must not exceed ${MAX_COORD} for either dimension (tech spec). Got: ${line}`,
    );
  }
  return { maxX, maxY };
};

/** One robot line: "x y O" -> position + orientation (N/S/E/W). */
export const parsePosition = (line: string): RobotState => {
  const parts = line.split(/\s+/);
  if (parts.length !== 3) {
    throw new Error(
      `Position line must be three space-separated values: x, y, and orientation (N, S, E or W), e.g. 1 1 E. Got: ${line}`,
    );
  }
  if (!isOrientation(parts[2])) {
    throw new Error(`Orientation must be N, S, E or W, got: ${parts[2]}`);
  }
  const x = parseIntStrict(parts[0], 'x', line);
  const y = parseIntStrict(parts[1], 'y', line);
  if (x < 0 || x > MAX_COORD || y < 0 || y > MAX_COORD) {
    throw new Error(
      `Position coordinates must be between 0 and ${MAX_COORD} (tech spec). Got: ${line}`,
    );
  }
  return {
    position: { x, y },
    orientation: parts[2],
  };
};

/** Command line: string of L/R/F -> array of Command. */
export const parseCommandString = (line: string): Command[] => {
  if (line.length > MAX_INSTRUCTION_LENGTH) {
    throw new Error(
      `Instruction string must be at most ${MAX_INSTRUCTION_LENGTH} characters (tech spec). Got: ${line.length}`,
    );
  }
  const out: Command[] = [];
  for (const char of line) {
    if (!isCommand(char)) {
      const show = char === ' ' ? 'space' : `"${char}"`;
      throw new Error(
        `Command line must be a continuous string of L, R and F only (no spaces or other characters). Invalid: ${show}. Use: ${COMMANDS.join(', ')}`,
      );
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
    if (positionLine === undefined || positionLine.trim() === '') {
      break; // trailing newline or blank line: end of input
    }
    if (commandLine === undefined) {
      throw new Error(`Missing command line after: ${positionLine}`);
    }
    robots.push(parseRobotInput(positionLine, commandLine));
  }

  return { grid, robots };
};
