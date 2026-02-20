# 👾 Martian Robots Implementation Plan

First draft on how to build the Martian Robots solution for Red Badger role.

## First Thoughts
I’ve never actually done the Mars Rover challenge before. I’ve read about it over the years and am excited to finally give it a go. For some reason I always picture the little rovers as the last few pieces left on a chessboard - probably because I was a bit of a chess nerd at school - so I’m looking forward to thinking about the movement and logic in that kind of way. If time allows, I’m also hoping to create a simple visual representation of the solution alongside the core implementation. 🤞

![Mars grid](./planning/mars-grid-whiteboard.png)  
*Whiteboard illustration made with ChatGPT.*

## Approach

- **Stack:** TypeScript + Node + Vitest + pnpm. Note to self: will probs need "fs" to read/write files as usual with these Node tasks.
- **Simple steps:** types > movement logic > parser > simulator > CLI.
- **Testing:** Vitest for unit tests. Focus on: parsing, movement rules, scent behaviour, and end-to-end sample output.
- **Code style:** Keep functions tiny and single-purpose; small helpers (e.g. parseIntStrict, isCommand) improve correctness and error messages without adding abstraction.

## Outline
1. Plan & scaffold project. (~20 min)
2. Extract/create types from tech spec (position, orientation, state etc.). (~20 min)
3. Base logic: move & rotate robots. Check bounds. Test. (~30 min)
4. Create parser. Example input: "5 3" and "1 1 E" / "RFRFRFRF" > structured data. Test. (~30 min)
5. Simulator. Run robots in order. Track scents. Implement safety bounds via scent. Test. (~20 min)
6. CLI + sample. Verify. (~20 min)
7. Quick UI. (if time permits) (~20 min)
8. Review & final touches: README, clean-up, DRY, elegant, easy to reason about, tests make sense, what I would add/change. (~20 min)

## Key behaviours to get right

1. **Orientation:**  
North: increase y
East: increase x
South: decrease y
West: decrease x  
2. Lost: If a robot moves off the grid, mark its last valid position as scented, output LOST, and stop that robot. 
3. Scent: If a move would fall off from a scented spot, ignore that move and stay in place.  
4. Order: Robots run one at a time, each finishing (or getting lost) before the next starts.  

## UI (2-3 hour constraint)  
I'd ❤️ to add some kind of UI representation so the simulation isn't only CLI.  
**Possible - hopefully doable within the timeframe - options:**  
- minimal web page that takes the same input, runs the simulator (shared logic) and shows the grid + final positions (and LOST) - e.g. a small chessboard-type grid drawn with CSS/HTML, one cell per coordinate, robots and "scents". Basically: `input` > `run` > `show results`.
- simple static HTML + JS (or tiny Vite page) that imports the core and renders the output. Keep  **"single source of truth"** inside the simulator.

## Trade-offs

- **UI scope:** UI is *not* the focus; I'll add a minimal view (input + grid result) *only if time allows*, after CLI and tests. Keep scope tight.
- **Input:** Parser assumes well-formed input (max coord 50, instructions & 100 chars). No heavy validation.
- **Scent storage:** Set of string keys e.g. `"x,y"`. Keep it simple; sufficient for tech test.

## Update/notes
### Simulator approach
**🎲 Treat it like game code. Easy to follow. Fun to build.**  
1. ⚒️ Create `runSimulation` that takes parsed input args (grid & robots). Loop over robots, then loop over commands.
2. ⚒️ L/R: `applyCommand`, update state, continue.
3. ✅ "F" in bounds: `forwardPosition` + `isInBounds` -> update state, continue.
4. ❌ "F" out of bounds: `scentKey` -> if in `scents`, skip; else add `scent`, push `lost`, break.
5. After command loop: if not lost, push result with `lost: false`.
6. 🧪 Test test refactor test
