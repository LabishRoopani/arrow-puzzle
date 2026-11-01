/**
 * Debug script — find which levels are unsolvable and why
 */
import { greedySolve } from '../../src/ai/solver.js';
import { getFreeMoves, buildDependencyGraph } from '../../src/ai/dependencyGraph.js';
import { isPathClear } from '../../src/engine/pathValidator.js';
import { cloneBoard, removeArrow } from '../../src/engine/gameState.js';
import { levels } from '../../src/data/levels.js';

for (const level of levels) {
  const solution = greedySolve(level.board);
  if (solution === null) {
    console.log(`\n❌ Level ${level.id} (${level.tier}, ${level.rows}×${level.cols}) — UNSOLVABLE`);

    // Find how far the greedy solver gets
    let current = cloneBoard(level.board);
    let step = 0;
    while (true) {
      const free = getFreeMoves(current);
      if (free.length === 0) break;
      const move = free[0];
      current = removeArrow(current, move.r, move.c);
      step++;
    }
    // Count remaining arrows
    let remaining = 0;
    const stuckArrows = [];
    for (let r = 0; r < current.length; r++) {
      for (let c = 0; c < current[0].length; c++) {
        if (current[r][c]) {
          remaining++;
          const result = isPathClear(current, r, c);
          stuckArrows.push(`  (${r},${c}) ${current[r][c].direction} → blocked by ${result.blockedBy ? `(${result.blockedBy.r},${result.blockedBy.c})` : 'N/A'}`);
        }
      }
    }
    console.log(`   Solved ${step} moves, then stuck with ${remaining} arrows remaining:`);
    stuckArrows.forEach(a => console.log(a));
  } else {
    console.log(`✅ Level ${level.id} (${level.tier}) — solvable in ${solution.length} moves`);
  }
}
