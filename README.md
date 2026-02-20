# Martian Robots

A small TypeScript CLI for the classic Martian Robots problem.

Robots move on a rectangular grid using `L`, `R`, and `F` commands.  
If a robot goes off the edge, it is **LOST** and leaves a scent so future robots ignore the same fatal move.

Built with Node, TypeScript, and Vitest.  
Terminal output is lightly styled with chalk for a retro mission-control feel.

![Terminal output](./assets/martian-robots-terminal-output.png)

**Prerequisites:** Node (see `.nvmrc`), pnpm.

## Quick start

```bash
nvm use
pnpm install
pnpm run build
pnpm start
```

**Interactive mode:**  
- paste input
- finish with Ctrl+D (Mac/Linux) or Ctrl+Z + Enter (Windows)

**Run sample input:**  
```bash
pnpm run:sample
```

**Run using a file:**  
```bash
node dist/cli.js path/to/input.txt
```

## Approach

This project is intentionally simple and readable. See [PLANNING.md](./PLANNING.md) for how the solution was approached and key trade-offs.

**Goals:** 
- clear domain logic
- predictable state transitions
- strong TypeScript without over-engineering
- pure core logic, easy to test
- thin CLI layer

**Core idea:**  
```bash
parse -> simulate -> format
```

**Structure**  
```bash
src/
  types.ts        # Domain types + helpers
  movement.ts     # L/R/F movement logic (pure)
  parser.ts       # Input parsing + validation
  simulator.ts    # Robot execution + scent rules
  cliHelpers.ts   # parse -> simulate -> format
  cli.ts          # CLI entrypoint
  cliUI.ts        # Terminal styling only
  *.test.ts       # Vitest tests

sample-input.txt
assets/
```

## Runtime flow
```bash
stdin/file -> parse -> simulate -> format -> stdout
```

- Parser validates input and builds domain objects.
- Simulator runs robots sequentially and tracks scents.
- Format step (in cliHelpers) outputs one line per robot (spec-compliant).
- CLI handles I/O and labels; results go to stdout so output is pipeable.

## Input format
```bash
maxX maxY
x y O
COMMANDS
x y O
COMMANDS
```

**Example:**  
```bash
37 20
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
```

**Rules:**  
- Orientation: N E S W
- Commands: L R F
- Command line has no spaces
- All letters = uppercase
- Robots execute one at a time

## Scripts

| Script            | Description          |
| ----------------- | -------------------- |
| `pnpm run build`  | Compile TypeScript   |
| `pnpm start`      | Run CLI (stdin mode) |
| `pnpm run:sample` | Run sample input     |
| `pnpm test`       | Run tests            |
| `pnpm test:watch` | Watch mode           |
| `pnpm lint`       | Lint source          |

Run `pnpm test` after clone to verify the setup.

## Notes

- Movement logic is pure.
- Bounds + scent handling live in the simulator.
- Scent is tracked by position + orientation.
- Output stays plain text so it matches the original problem spec.

### Licence
MIT

