/**
 * Terminal styling only.
 *
 * This file exists purely to make the CLI look nice in the terminal (colours,
 * boxes, copy). It is not important to how the app works — the simulator and
 * parser do not depend on it. It just adds fun. Used by cli.ts so main() stays minimal.
 */
import chalk from 'chalk';

const dim = chalk.gray;
const grid = chalk.blueBright;
const pos = chalk.yellow;
const cmd = chalk.green;
const rule = chalk.cyan;
const accent = chalk.white;
const glow = chalk.magenta;
const highlight = chalk.yellow;

const pad = (s: string, w: number) =>
  s + ' '.repeat(Math.max(0, w - s.length));

/** Full stdin prompt: banner, intro, example box, tips, input label. */
export const getStdinPrompt = (): string => {
  const bw = 50;
  const banner =
    '\n  ' +
    rule('╔' + '═'.repeat(bw - 2) + '╗') +
    '\n  ' +
    rule('║  ') +
    glow('🪐  MARTIAN ROBOTS  🪐'.padEnd(bw - 6)) +
    rule('  ║') +
    '\n  ' +
    rule('║  ') +
    dim('Your fleet. Your commands. Don\'t lose them.'.padEnd(bw - 6)) +
    rule('  ║') +
    '\n  ' +
    rule('╚' + '═'.repeat(bw - 2) + '╝') +
    '\n\n';

  const intro =
    '  ' +
    highlight('You\'re in command. ') +
    dim('Deploy robots on the Mars grid and send each one a sequence of moves. ') +
    dim('If a robot goes off the edge, it\'s ') +
    chalk.redBright('LOST') +
    dim(' — but it leaves a scent so the next one won\'t make the same mistake. ') +
    highlight('How many can you bring home?') +
    '\n\n';

  const boxW = 44;
  const innerW = boxW - 6;
  const row = (content: string) =>
    '  ' + rule('│  ') + content + rule('  │') + '\n';

  const visual =
    '  ' +
    rule('┌' + '─'.repeat(boxW - 2) + '┐') +
    '\n  ' +
    rule('│  ') +
    glow(pad('Mission format — copy the structure:', innerW)) +
    rule('  │') +
    '\n  ' +
    rule('│  ') +
    pad('', innerW) +
    rule('  │') +
    '\n' +
    row(grid(pad('5 3', innerW))) +
    row(pos(pad('1 1 E', innerW))) +
    row(cmd(pad('RFRFRFRF', innerW))) +
    row(pos(pad('3 2 N', innerW))) +
    row(cmd(pad('FRRFLLFFRRFLL', innerW))) +
    '  ' +
    rule('│  ') +
    pad('', innerW) +
    rule('  │') +
    '\n  ' +
    rule('└' + '─'.repeat(boxW - 2) + '┘') +
    '\n  ' +
    dim('  grid size  →  position ') +
    pos('x y O') +
    dim('  →  commands ') +
    cmd('L R F') +
    dim('  (repeat for more robots)') +
    '\n\n';

  const tips =
    '  ' +
    highlight('Ready? ') +
    dim('Use capitals only: ') +
    accent('N S E W') +
    dim(' and ') +
    accent('L R F') +
    dim('.  When you\'re done, send your mission: ') +
    accent.bold('Ctrl+D') +
    dim(' (Mac/Linux) or ') +
    accent.bold('Ctrl+Z') +
    dim(' + Enter (Windows).') +
    '\n\n';

  const inputLabel =
    '  ' +
    rule('▼ ') +
    glow.bold('Enter your mission') +
    '\n  ' +
    rule('─'.repeat(40)) +
    '\n';

  return banner + intro + visual + tips + inputLabel;
};

/** Label shown before results when running from stdin. */
export const getMissionReportLabel = (): string =>
  '\n  ' +
  rule('▼ ') +
  chalk.bold.magenta('Mission report') +
  '\n  ' +
  rule('─'.repeat(40)) +
  '\n\n';

/** Header when running from a file (path + results explanation). */
export const getFileHeader = (path: string): string =>
  rule('  Running mission from ') +
  chalk.white.bold(path) +
  rule('.\n\n') +
  rule('  Mission report — each line: final position and orientation; ') +
  chalk.red('LOST') +
  rule(' = robot fell off the grid.\n\n');

/** One result line: green ✓ or red ⚠ with bold coords. */
export const formatResultLine = (line: string): string => {
  const lost = line.endsWith(' LOST');
  const style = lost ? chalk.red : chalk.green;
  const icon = lost ? '  ⚠ ' : '  ✓ ';
  return style(icon) + style.bold(line);
};

/** Message when there are no robots. */
export const formatNoRobots = (): string => dim('  (no robots deployed)');

/** Error message (mission failed + message). */
export const formatError = (msg: string): string =>
  chalk.red('\n  ✗ Mission failed: ') + chalk.redBright(msg) + '\n';
