/**
 * generateCampaignLevels.mjs — Generate all 20 solvable campaign levels
 *
 * Strategy: For each level config, generate random boards and validate with solver.
 * Use seeded approach: pick free arrows that CAN exit, verify with greedySolve.
 *
 * Reverse-simulation: Start with empty board, pick a border cell, point arrow
 * inward from border. This guarantees the arrow can exit back out.
 * Build up arrows one by one, always keeping board solvable.
 */

import { DIRECTIONS, DELTA } from '../../src/engine/gameRules.js';
import { greedySolve, isSolvable } from '../../src/ai/solver.js';
import { cloneBoard } from '../../src/engine/gameState.js';

const DIR_LIST = Object.values(DIRECTIONS);

const OPPOSITE = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

/**
 * Reverse-simulation level generator with guaranteed solvability.
 * 
 * Algorithm:
 * 1. Start with empty board
 * 2. Pick a random border slot (edge row/col + direction pointing inward)
 * 3. Place arrow at a random depth along that entry vector
 * 4. Verify board is still solvable after placement
 * 5. If not solvable, undo and try another placement
 * 6. Repeat until target arrow count reached
 */
function generateSolvableLevel(rows, cols, arrowCount, maxAttempts = 500) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const board = Array.from({ length: rows }, () => Array(cols).fill(null));
    let placed = 0;
    let tries = 0;
    const maxTries = arrowCount * 50;

    while (placed < arrowCount && tries < maxTries) {
      tries++;
      
      // Pick a random empty cell
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (board[r][c] !== null) continue;

      // Pick a direction that can potentially exit (has clear path to border)
      const shuffledDirs = [...DIR_LIST].sort(() => Math.random() - 0.5);
      let foundDir = null;

      for (const dir of shuffledDirs) {
        // Check if this arrow could potentially exit in this direction
        const delta = DELTA[dir];
        let cr = r + delta.r;
        let cc = c + delta.c;
        let pathClear = true;

        while (cr >= 0 && cr < rows && cc >= 0 && cc < cols) {
          if (board[cr][cc] !== null) {
            pathClear = false;
            break;
          }
          cr += delta.r;
          cc += delta.c;
        }

        if (pathClear) {
          foundDir = dir;
          break;
        }
      }

      if (!foundDir) continue;

      // Place the arrow
      board[r][c] = { direction: foundDir };
      
      // Verify still solvable
      if (isSolvable(board)) {
        placed++;
      } else {
        // Undo — this placement created an unsolvable config
        board[r][c] = null;
      }
    }

    if (placed >= arrowCount) {
      return board;
    }
  }
  return null;
}

// Level specifications from AGENTS.md
const LEVEL_SPECS = [
  // Tutorial: 3×3
  { id: 1,  tier: 'Tutorial',     rows: 3, cols: 3, arrows: 3  },
  { id: 2,  tier: 'Tutorial',     rows: 3, cols: 3, arrows: 5  },
  { id: 3,  tier: 'Tutorial',     rows: 3, cols: 3, arrows: 6  },
  // Beginner: 4×4
  { id: 4,  tier: 'Beginner',     rows: 4, cols: 4, arrows: 8  },
  { id: 5,  tier: 'Beginner',     rows: 4, cols: 4, arrows: 9  },
  { id: 6,  tier: 'Beginner',     rows: 4, cols: 4, arrows: 10 },
  { id: 7,  tier: 'Beginner',     rows: 4, cols: 4, arrows: 10 },
  // Intermediate: 5×5
  { id: 8,  tier: 'Intermediate', rows: 5, cols: 5, arrows: 14 },
  { id: 9,  tier: 'Intermediate', rows: 5, cols: 5, arrows: 15 },
  { id: 10, tier: 'Intermediate', rows: 5, cols: 5, arrows: 16 },
  { id: 11, tier: 'Intermediate', rows: 5, cols: 5, arrows: 17 },
  { id: 12, tier: 'Intermediate', rows: 5, cols: 5, arrows: 18 },
  // Advanced: 6×6
  { id: 13, tier: 'Advanced',     rows: 6, cols: 6, arrows: 22 },
  { id: 14, tier: 'Advanced',     rows: 6, cols: 6, arrows: 23 },
  { id: 15, tier: 'Advanced',     rows: 6, cols: 6, arrows: 24 },
  { id: 16, tier: 'Advanced',     rows: 6, cols: 6, arrows: 25 },
  { id: 17, tier: 'Advanced',     rows: 6, cols: 6, arrows: 26 },
  // Master: 7×7 and 8×8
  { id: 18, tier: 'Master',       rows: 7, cols: 7, arrows: 30 },
  { id: 19, tier: 'Master',       rows: 7, cols: 7, arrows: 35 },
  { id: 20, tier: 'Master',       rows: 8, cols: 8, arrows: 40 },
];

console.log('Generating 20 solvable campaign levels...\n');

const generatedLevels = [];

for (const spec of LEVEL_SPECS) {
  process.stdout.write(`Level ${spec.id} (${spec.tier} ${spec.rows}×${spec.cols}, ${spec.arrows} arrows)... `);
  const board = generateSolvableLevel(spec.rows, spec.cols, spec.arrows);
  
  if (board) {
    const solution = greedySolve(board);
    console.log(`✅ Generated! Solution: ${solution.length} moves`);
    generatedLevels.push({
      id: spec.id,
      name: `Level ${spec.id}`,
      tier: spec.tier,
      rows: spec.rows,
      cols: spec.cols,
      board: board,
    });
  } else {
    console.log('❌ FAILED to generate');
  }
}

// Output as JS source code
console.log('\n\n// ========== GENERATED levels.js content ==========\n');

function cellToString(cell) {
  if (cell === null) return '_';
  return `{ direction: D.${cell.direction} }`;
}

function padCell(str, width) {
  return str.padEnd(width);
}

console.log(`import { DIRECTIONS as D } from '../engine/gameRules.js';\n`);
console.log(`const _ = null;\n`);
console.log(`export const levels = [`);

for (const level of generatedLevels) {
  console.log(`  {`);
  console.log(`    id: ${level.id},`);
  console.log(`    name: '${level.name}',`);
  console.log(`    tier: '${level.tier}',`);
  console.log(`    rows: ${level.rows},`);
  console.log(`    cols: ${level.cols},`);
  console.log(`    board: [`);
  
  for (const row of level.board) {
    const cells = row.map(cell => padCell(cellToString(cell), 27));
    console.log(`      [${cells.join(', ')}],`);
  }
  
  console.log(`    ],`);
  console.log(`  },\n`);
}

console.log(`];\n`);
console.log(`export const TOTAL_LEVELS = levels.length;`);

