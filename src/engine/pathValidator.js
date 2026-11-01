/**
 * pathValidator.js — Member 2: Core Game Engine
 * Raycasting line-of-sight clearance checker.
 */

import { DELTA } from './gameRules.js';

/**
 * Shoots a ray from (startRow, startCol) in the arrow's direction.
 * Returns { clear: true } if the path reaches the border unobstructed,
 * or { clear: false, blockedBy: { r, c } } if another arrow is in the way.
 *
 * @param {Array<Array<object|null>>} board
 * @param {number} startRow
 * @param {number} startCol
 * @returns {{ clear: boolean, blockedBy?: { r: number, c: number } }}
 */
export function isPathClear(board, startRow, startCol) {
  const arrow = board[startRow][startCol];
  if (!arrow) return { clear: false };

  const { r: dr, c: dc } = DELTA[arrow.direction];
  let currR = startRow + dr;
  let currC = startCol + dc;

  const numRows = board.length;
  const numCols = board[0].length;

  while (currR >= 0 && currR < numRows && currC >= 0 && currC < numCols) {
    if (board[currR][currC] !== null) {
      return { clear: false, blockedBy: { r: currR, c: currC } };
    }
    currR += dr;
    currC += dc;
  }

  return { clear: true };
}
