/**
 * gameState.js — Member 2: Core Game Engine
 * Immutable board updates, move history stack, and score tracking.
 *
 * TODO (Member 2):
 * - Implement removeArrow(board, row, col)
 * - Implement pushHistory(history, boardSnapshot)
 * - Implement undoLastMove(history)
 * - Implement incrementMoveCount(state)
 */

/**
 * Creates a deep clone of the board (2D array) to keep state immutable.
 * @param {Array<Array<object|null>>} board
 * @returns {Array<Array<object|null>>}
 */
export function cloneBoard(board) {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

/**
 * Removes the arrow at (row, col) from the board.
 * Returns a new board with that cell set to null.
 * @param {Array<Array<object|null>>} board
 * @param {number} row
 * @param {number} col
 * @returns {Array<Array<object|null>>}
 */
export function removeArrow(board, row, col) {
  const next = cloneBoard(board);
  next[row][col] = null;
  return next;
}
