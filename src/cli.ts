/**
 * CLI: read input from file or stdin, run simulator, print results.
 * Usage: node dist/cli.js [input-file]
 *
 * Flow: show prompt (if stdin) -> read input -> parse & simulate -> print results or error.
 */
import { readFileSync } from 'fs';
import {
  runFromInput,
  getStdinPrompt,
  getMissionReportLabel,
  getFileHeader,
  formatResultLine,
  formatNoRobots,
  formatError,
} from './cliHelpers';

const isStdin = (): boolean => !process.argv[2];

const main = (): void => {
  const path = process.argv[2];

  if (isStdin()) {
    process.stderr.write(getStdinPrompt());
  }

  const input = path
    ? readFileSync(path, 'utf-8')
    : readFileSync(0, 'utf-8');

  try {
    const output = runFromInput(input);

    if (isStdin() && output) {
      process.stderr.write(getMissionReportLabel());
    }
    if (path && output) {
      process.stderr.write(getFileHeader(path));
    }

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
