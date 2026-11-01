/**
 * gameRules.js — Member 2: Core Game Engine
 * Direction constants, delta vectors, and coordinate utilities.
 */

export const DIRECTIONS = {
  UP:    'UP',
  DOWN:  'DOWN',
  LEFT:  'LEFT',
  RIGHT: 'RIGHT',
};

/** Delta vectors: how row/col change per step for each direction */
export const DELTA = {
  UP:    { r: -1, c:  0 },
  DOWN:  { r:  1, c:  0 },
  LEFT:  { r:  0, c: -1 },
  RIGHT: { r:  0, c:  1 },
};

/** CSS rotation degrees for each direction arrow icon */
export const ROTATION = {
  UP:    0,
  RIGHT: 90,
  DOWN:  180,
  LEFT:  270,
};

/**
 * Check whether a (row, col) coordinate is inside the board.
 * @param {number} row
 * @param {number} col
 * @param {number} numRows
 * @param {number} numCols
 * @returns {boolean}
 */
export function inBounds(row, col, numRows, numCols) {
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
}

/**
 * Check whether all cells in the board are cleared (null).
 * @param {Array<Array<object|null>>} board
 * @returns {boolean}
 */
export function isLevelComplete(board) {
  return board.every(row => row.every(cell => cell === null));
}
