/**
 * Domain types and constants for Martian grid and robots.
 * Includes: orientation, position, grid bounds, robot state.
 */

// Orientations (N/S/E/W)
export type Orientation = 'N' | 'S' | 'E' | 'W';

// Position (grid coordinates; integers)
export type Position = { x: number; y: number };

export type Delta = { dx: number; dy: number };

export const ORIENTATIONS = ['N', 'E', 'S', 'W'] as const;

export const isOrientation = (s: string): s is Orientation =>
  (ORIENTATIONS as readonly string[]).includes(s);

export const positionKey = (p: Position): string => `${p.x},${p.y}`;

// Scent key should include orientation to represent "falling off from this cell while facing this direction"
export const scentKey = (p: Position, o: Orientation): string =>
  `${p.x},${p.y},${o}`;

// Grid (rectangular bounds; lower-left is 0,0)
export interface Grid {
  /** Upper-right x (inclusive). Lower-left x is 0. */
  maxX: number;
  /** Upper-right y (inclusive). Lower-left y is 0. */
  maxY: number;
}

/** Point is inside the grid: x in [0, maxX], y in [0, maxY] (inclusive). */
export const isInBounds = (grid: Grid, p: Position): boolean => {
  const inX = p.x >= 0 && p.x <= grid.maxX;
  const inY = p.y >= 0 && p.y <= grid.maxY;
  return inX && inY;
};

// Robot state (current position + orientation during simulation)
export interface RobotState {
  position: Position;
  orientation: Orientation;
}

// Robot result (output per robot)
export interface RobotResult {
  position: Position;
  orientation: Orientation;
  lost: boolean;
}
