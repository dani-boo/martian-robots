/**
 * Runs the Martian Robots simulation: one robot at a time, tracking scents.
 * A robot that would move off the grid from a scented cell skips that move; otherwise it is lost and leaves a scent.
 */
import type { RobotResult, RobotState } from './types';
import { isInBounds, scentKey } from './types';
import type { ParsedInput } from './parser';
import { applyCommand, forwardPosition } from './movement';

/**
 * Run all robots in order. Each robot runs to completion (or is lost) before the next starts.
 * Scents persist across robots; a move that would fall off from a scented cell is skipped.
 */
export const runSimulation = (parsed: ParsedInput): RobotResult[] => {
  const { grid, robots } = parsed;
  const scents = new Set<string>();
  const results: RobotResult[] = [];

  for (const robot of robots) {
    let state: RobotState = { ...robot.state };
    let lost = false;

    for (const command of robot.commands) {
      if (command === 'L' || command === 'R') {
        state = applyCommand(state, command);
        continue;
      }

      // F: move forward if in bounds; else check scent, then lose or skip
      const nextPos = forwardPosition(state.position, state.orientation);
      if (isInBounds(grid, nextPos)) {
        state = { ...state, position: nextPos };
        continue;
      }

      const key = scentKey(state.position, state.orientation);
      if (scents.has(key)) {
        // Already lost from this cell facing this way: skip move, stay put
        continue;
      }

      scents.add(key);
      results.push({
        position: state.position,
        orientation: state.orientation,
        lost: true,
      });
      lost = true;
      break;
    }

    if (!lost) {
      results.push({
        position: state.position,
        orientation: state.orientation,
        lost: false,
      });
    }
  }

  return results;
};
