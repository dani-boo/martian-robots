/**
 * Shared test input strings for unit tests.
 * Single source of truth so parser, simulator, and cliHelpers tests don't duplicate.
 */

/** Official example from tech test spec (3 robots). */
export const sampleInput = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;

/** Grid only; no robots. */
export const gridOnlyInput = `5 3`;

/** One robot, no commands (missing command line). */
export const singleRobotNoCommandsInput = `5 3
1 1 E`;

/** One robot, short command string. */
export const singleRobotShortInput = `5 3
0 0 N
FF`;

/** Two robots, different orientations and short commands. */
export const twoRobotsInput = `10 10
0 0 N
L
5 5 S
RR`;
