/**
 * dependencyGraph.js — Member 3: AI Solver
 * Builds a Directed Acyclic Graph (DAG) of arrow dependencies.
 *
 * For each arrow A, we find which other arrows block its exit path.
 * The DAG tells us: "Arrow A can only exit AFTER arrows [B, C...] have exited."
 *
 * TODO (Member 3): Implement buildDependencyGraph()
 */

import { DELTA } from '../engine/gameRules.js';
import { isPathClear } from '../engine/pathValidator.js';

/**
 * Build a dependency map from the current board.
 * Returns a Map: key = "r,c" string, value = Set of "r,c" strings that block it.
 *
 * @param {Array<Array<object|null>>} board
 * @returns {Map<string, Set<string>>}
 */
export function buildDependencyGraph(board) {
  const deps = new Map();

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (!board[r][c]) continue;
      const key = `${r},${c}`;
      deps.set(key, new Set());

      const result = isPathClear(board, r, c);
      if (!result.clear && result.blockedBy) {
        const { r: br, c: bc } = result.blockedBy;
        deps.get(key).add(`${br},${bc}`);
      }
    }
  }

  return deps;
}

/**
 * Get all arrows that are currently free to exit (no blockers).
 * @param {Array<Array<object|null>>} board
 * @returns {Array<{ r: number, c: number }>}
 */
export function getFreeMoves(board) {
  const free = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (!board[r][c]) continue;
      const result = isPathClear(board, r, c);
      if (result.clear) free.push({ r, c });
    }
  }
  return free;
}
