/**
 * solver.js — Member 3: AI Solver
 * Greedy solver that generates a complete solution sequence.
 *
 * Strategy: At each step, pick any arrow that can freely exit.
 * Because removing a free arrow never blocks others (monotonic freedom),
 * greedy is always sufficient for this puzzle type.
 *
 * For harder variants or optimal (minimum-step) solutions, BFS is used.
 *
 * TODO (Member 3): Implement BFS solver for optimal hint sequences.
 */

import { cloneBoard, removeArrow } from '../engine/gameState.js';
import { isLevelComplete } from '../engine/gameRules.js';
import { getFreeMoves } from './dependencyGraph.js';

/**
 * Greedy solver — returns an ordered array of moves to solve the board.
 * Each move is { r, c }.
 *
 * @param {Array<Array<object|null>>} board
 * @returns {Array<{ r: number, c: number }>|null} solution sequence or null if unsolvable
 */
export function greedySolve(board) {
  let current = cloneBoard(board);
  const solution = [];

  while (!isLevelComplete(current)) {
    const freeMoves = getFreeMoves(current);
    if (freeMoves.length === 0) return null; // unsolvable

    const move = freeMoves[0]; // greedy: pick first available
    solution.push({ r: move.r, c: move.c });
    current = removeArrow(current, move.r, move.c);
  }

  return solution;
}

/**
 * Check if a board configuration is solvable at all.
 * Used by the level generator to validate generated levels.
 *
 * @param {Array<Array<object|null>>} board
 * @returns {boolean}
 */
export function isSolvable(board) {
  return greedySolve(board) !== null;
}
