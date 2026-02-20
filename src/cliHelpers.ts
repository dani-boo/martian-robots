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
