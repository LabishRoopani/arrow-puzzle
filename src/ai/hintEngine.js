/**
 * hintEngine.js — Member 3: AI Solver
 * BFS-based hint calculator — suggests the next best move.
 *
 * Strategy: Among all currently free arrows, pick the one that,
 * after being removed, unlocks the maximum number of newly free arrows.
 * This maximizes "cascade potential" and finds the most impactful move.
 *
 * TODO (Member 3): Implement full BFS for shortest-path hint sequences.
 */

import { cloneBoard, removeArrow } from '../engine/gameState.js';
import { getFreeMoves } from './dependencyGraph.js';

/**
 * Returns the single best next move as { r, c }.
 * Picks the free arrow whose removal unlocks the most downstream arrows.
 *
 * @param {Array<Array<object|null>>} board
 * @returns {{ r: number, c: number }|null}
 */
export function getBestHint(board) {
  const freeMoves = getFreeMoves(board);
  if (freeMoves.length === 0) return null;

  let bestMove = null;
  let bestUnlocked = -1;

  for (const move of freeMoves) {
    const boardAfter   = removeArrow(cloneBoard(board), move.r, move.c);
    const newlyFree    = getFreeMoves(boardAfter).length;

    if (newlyFree > bestUnlocked) {
      bestUnlocked = newlyFree;
      bestMove = move;
    }
  }

  return bestMove;
}
