/**
 * levelGenerator.js — AI Solver & Procedural Level Generator
 * 
 * Guarantees 100% solvable levels across:
 * Easy -> Medium -> Hard -> Extreme (Infinite Cycle)
 */

import { DIRECTIONS, DELTA } from '../engine/gameRules.js';
import { greedySolve, isSolvable } from './solver.js';

const DIR_LIST = Object.values(DIRECTIONS);

export const TIERS = ['Easy', 'Medium', 'Hard', 'Extreme'];

/**
 * Difficulty parameters tuned for reliable generation and fun gameplay
 */
export const DIFFICULTY_PRESETS = {
  Easy: {
    rows: 4,
    cols: 4,
    arrowCount: 6,
    maxTries: 200
  },
  Medium: {
    rows: 5,
    cols: 5,
    arrowCount: 11,
    maxTries: 300
  },
  Hard: {
    rows: 6,
    cols: 6,
    arrowCount: 18,
    maxTries: 400
  },
  Extreme: {
    rows: 7,
    cols: 7,
    arrowCount: 26,
    maxTries: 500
  }
};

/**
 * Get tier name based on 1-based level index
 * 1: Easy, 2: Medium, 3: Hard, 4: Extreme, 5: Easy, ...
 */
export function getLevelTier(levelNumber) {
  const index = (levelNumber - 1) % 4;
  return TIERS[index];
}

/**
 * Procedural generation using reverse placement & incremental solvability check.
 * This guarantees the board is 100% solvable without freezing or hanging.
 */
export function generateSolvableLevel(tierName) {
  const config = DIFFICULTY_PRESETS[tierName] || DIFFICULTY_PRESETS.Easy;
  const { rows, cols, arrowCount, maxTries } = config;

  for (let attempt = 0; attempt < 50; attempt++) {
    const board = Array.from({ length: rows }, () => Array(cols).fill(null));
    let placed = 0;
    let stepTries = 0;

    while (placed < arrowCount && stepTries < maxTries) {
      stepTries++;
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (board[r][c] !== null) continue;

      // Pick a random direction
      const randomDir = DIR_LIST[Math.floor(Math.random() * DIR_LIST.length)];
      board[r][c] = { direction: randomDir };

      // Check if board is still solvable after placing this arrow
      if (isSolvable(board)) {
        placed++;
      } else {
        // Revert invalid placement
        board[r][c] = null;
      }
    }

    if (placed >= arrowCount && isSolvable(board)) {
      return {
        rows,
        cols,
        board,
        arrowCount: placed
      };
    }
  }

  // Fallback: Guaranteed solvable template if random sampling hit max attempts
  return createGuaranteedFallback(rows, cols, arrowCount);
}

/**
 * Fallback generator that builds guaranteed outward paths
 */
function createGuaranteedFallback(rows, cols, count) {
  const board = Array.from({ length: rows }, () => Array(cols).fill(null));
  let placed = 0;

  // Fill outer perimeters pointing outside first
  for (let r = 0; r < rows && placed < count; r++) {
    for (let c = 0; c < cols && placed < count; c++) {
      if ((r === 0 || r === rows - 1 || c === 0 || c === cols - 1) && Math.random() > 0.3) {
        let dir = DIRECTIONS.UP;
        if (r === 0) dir = DIRECTIONS.UP;
        else if (r === rows - 1) dir = DIRECTIONS.DOWN;
        else if (c === 0) dir = DIRECTIONS.LEFT;
        else if (c === cols - 1) dir = DIRECTIONS.RIGHT;

        board[r][c] = { direction: dir };
        placed++;
      }
    }
  }

  return { rows, cols, board, arrowCount: placed };
}
