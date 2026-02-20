/**
 * CLI helpers: input string -> output string (parse, simulate, format).
 * Used by the CLI and by tests.
 */
import { parseInput } from './parser';
import { runSimulation } from './simulator';
import type { RobotResult } from './types';

/** One robot result as spec output line: "x y O" or "x y O LOST". */
export const formatResult = (r: RobotResult): string =>
  `${r.position.x} ${r.position.y} ${r.orientation}${r.lost ? ' LOST' : ''}`;

/** Parse input, run simulation, return full output (one line per robot). Throws on parse error. */
export const runFromInput = (input: string): string => {
  const parsed = parseInput(input);
  const results = runSimulation(parsed);
  return results.map(formatResult).join('\n');
};

// CLI display helpers (prompts, labels, result formatting)

export const getStdinPrompt = (): string =>
  '\n  MARTIAN ROBOTS\n  Enter grid (maxX maxY), then for each robot: position (x y O) and commands (L R F).\n  When done: Ctrl+D (Mac/Linux) or Ctrl+Z + Enter (Windows).\n\n  Enter your mission:\n  ----------------------------------------\n';

export const getMissionReportLabel = (): string =>
  '\n  Mission report\n  ----------------------------------------\n\n';

export const getFileHeader = (path: string): string =>
  '  Running mission from ' +
  path +
  '.\n\n  Mission report — each line: final position and orientation; LOST = robot fell off the grid.\n\n';

export const formatResultLine = (line: string): string => {
  const lost = line.endsWith(' LOST');
  const icon = lost ? '  ⚠ ' : '  ✓ ';
  return icon + line;
};

export const formatNoRobots = (): string => '  (no robots deployed)';

export const formatError = (msg: string): string =>
  '\n  ✗ Mission failed: ' + msg + '\n';
