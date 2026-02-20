/**
 * Core movement logic: turn left/right, move forward.
 */
import type { Delta, Orientation, Position, RobotState } from './types';

// Turn left 90° (N -> W -> S -> E -> N)
const TURN_LEFT: Record<Orientation, Orientation> = {
  N: 'W',
  W: 'S',
  S: 'E',
  E: 'N',
};

export const turnLeft = (orientation: Orientation): Orientation =>
  TURN_LEFT[orientation];

// Turn right 90° (N -> E -> S -> W -> N)
const TURN_RIGHT: Record<Orientation, Orientation> = {
  N: 'E',
  E: 'S',
  S: 'W',
  W: 'N',
};

export const turnRight = (orientation: Orientation): Orientation =>
  TURN_RIGHT[orientation];

// Forward: one grid step in current orientation (N = +y, E = +x, S = -y, W = -x)
const FORWARD_DELTA = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
} as const satisfies Record<Orientation, Delta>;

export const forwardPosition = (
  position: Position,
  orientation: Orientation,
): Position => {
  const { dx, dy } = FORWARD_DELTA[orientation];
  return { x: position.x + dx, y: position.y + dy };
};

// Movement command set (pure): L/R change orientation; F updates position.
export const COMMANDS = ['L', 'R', 'F'] as const;
export type Command = (typeof COMMANDS)[number];

const COMMAND_SET: ReadonlySet<string> = new Set(COMMANDS);
export const isCommand = (c: string): c is Command => COMMAND_SET.has(c);

export const formatValidCommands = (): string => COMMANDS.join(', ');

// Default branch helper: keep a `default` but preserve exhaustiveness via `never`.
const unreachable = (value: never): never => {
  throw new Error(`Unknown command value: ${value}. Please use one of the following: ${formatValidCommands()}`);
};

export const applyCommand = (
  state: RobotState,
  command: Command,
): RobotState => {
  switch (command) {
    case 'L':
      return { ...state, orientation: turnLeft(state.orientation) };

    case 'R':
      return { ...state, orientation: turnRight(state.orientation) };

    case 'F':
      // Preserve future RobotState fields via spread; only update position.
      return {
        ...state,
        position: forwardPosition(state.position, state.orientation),
      };

    default:
      return unreachable(command);
  }
};
