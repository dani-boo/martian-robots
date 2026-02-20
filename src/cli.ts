/**
 * CLI: read input from file or stdin, run simulator, print results.
 * Usage: node dist/cli.js [input-file]
 *
 * Flow: show prompt (if stdin) → read input → parse & simulate → print results or error.
 * All styling lives in cliUI; this file only orchestrates I/O and output.
 */
import { readFileSync } from 'fs';
import { runFromInput } from './cliHelpers';
import {
  getStdinPrompt,
  getMissionReportLabel,
  getFileHeader,
  formatResultLine,
  formatNoRobots,
  formatError,
} from './cliUI';

const isStdin = (): boolean => !process.argv[2];

const main = (): void => {
  const path = process.argv[2];

  // Interactive mode: show game intro and instructions before reading stdin
  if (isStdin()) {
    process.stderr.write(getStdinPrompt());
  }

  // Read from file or stdin (fd 0)
  const input = path
    ? readFileSync(path, 'utf-8')
    : readFileSync(0, 'utf-8');

  try {
    const output = runFromInput(input);

    // Labels/headers go to stderr so stdout stays clean for piping
    if (isStdin() && output) {
      process.stderr.write(getMissionReportLabel());
    }
    if (path && output) {
      process.stderr.write(getFileHeader(path));
    }

    // Results to stdout (one line per robot; green ✓ or red ⚠ for LOST)
    if (output) {
      output.split('\n').forEach((line) => console.log(formatResultLine(line)));
    } else {
      console.log(formatNoRobots());
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(formatError(msg));
    process.exit(1);
  }
};

main();
