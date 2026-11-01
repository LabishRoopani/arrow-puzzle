/**
 * gameState.test.js — Undo / Reset / Immutability Tests
 *
 * Verify:
 * 1. cloneBoard creates a true deep copy (mutation isolation)
 * 2. removeArrow removes correctly and returns new board (immutable)
 * 3. Undo simulation: history stack restores previous board state
 * 4. Reset simulation: board matches initial level configuration
 */

import { describe, it, expect } from 'vitest';
import { cloneBoard, removeArrow } from '../src/engine/gameState.js';
import { DIRECTIONS as D } from '../src/engine/gameRules.js';

const _ = null;

describe('gameState — cloneBoard', () => {

  it('should produce an identical board', () => {
    const board = [
      [{ direction: D.UP }, _, { direction: D.RIGHT }],
      [_, { direction: D.DOWN }, _],
    ];
    const clone = cloneBoard(board);
    expect(clone).toEqual(board);
  });

  it('should produce a deep copy — mutations do not propagate', () => {
    const board = [
      [{ direction: D.UP }, _],
      [_, { direction: D.DOWN }],
    ];
    const clone = cloneBoard(board);

    // Mutate the clone
    clone[0][0] = null;
    clone[1][1].direction = D.LEFT;

    // Original should be unaffected
    expect(board[0][0]).toEqual({ direction: D.UP });
    expect(board[1][1]).toEqual({ direction: D.DOWN });
  });

  it('should correctly clone a board with all nulls', () => {
    const board = [[_, _], [_, _]];
    const clone = cloneBoard(board);
    expect(clone).toEqual(board);
    clone[0][0] = { direction: D.UP };
    expect(board[0][0]).toBeNull();
  });
});

describe('gameState — removeArrow', () => {

  it('should set the specified cell to null', () => {
    const board = [
      [{ direction: D.UP }, { direction: D.RIGHT }],
      [{ direction: D.DOWN }, { direction: D.LEFT }],
    ];
    const result = removeArrow(board, 0, 1);
    expect(result[0][1]).toBeNull();
  });

  it('should NOT mutate the original board (immutability)', () => {
    const board = [
      [{ direction: D.UP }, { direction: D.RIGHT }],
    ];
    const result = removeArrow(board, 0, 0);
    expect(result[0][0]).toBeNull();
    expect(board[0][0]).toEqual({ direction: D.UP }); // original untouched
  });

  it('should preserve all other cells exactly', () => {
    const board = [
      [{ direction: D.UP }, { direction: D.RIGHT }, _],
      [_, { direction: D.DOWN }, { direction: D.LEFT }],
    ];
    const result = removeArrow(board, 1, 1);
    expect(result[0][0]).toEqual({ direction: D.UP });
    expect(result[0][1]).toEqual({ direction: D.RIGHT });
    expect(result[0][2]).toBeNull();
    expect(result[1][0]).toBeNull();
    expect(result[1][1]).toBeNull(); // removed
    expect(result[1][2]).toEqual({ direction: D.LEFT });
  });
});

describe('gameState — Undo simulation', () => {

  it('should restore previous board state from history stack', () => {
    const initialBoard = [
      [{ direction: D.UP }, { direction: D.RIGHT }],
      [{ direction: D.DOWN }, _],
    ];
    const history = [];

    // Move 1: remove (0,0)
    history.push(cloneBoard(initialBoard));
    const board1 = removeArrow(initialBoard, 0, 0);
    expect(board1[0][0]).toBeNull();

    // Move 2: remove (0,1)
    history.push(cloneBoard(board1));
    const board2 = removeArrow(board1, 0, 1);
    expect(board2[0][1]).toBeNull();

    // Undo move 2
    const undone1 = history.pop();
    expect(undone1[0][0]).toBeNull();
    expect(undone1[0][1]).toEqual({ direction: D.RIGHT });

    // Undo move 1
    const undone2 = history.pop();
    expect(undone2[0][0]).toEqual({ direction: D.UP });
    expect(undone2[0][1]).toEqual({ direction: D.RIGHT });
    expect(undone2).toEqual(initialBoard);
  });

  it('should handle undo on empty history gracefully', () => {
    const history = [];
    expect(history.length).toBe(0);
    // Pop on empty array returns undefined — app must check length first
    expect(history.pop()).toBeUndefined();
  });
});

describe('gameState — Reset simulation', () => {

  it('should produce board identical to initial level config after reset', () => {
    const levelBoard = [
      [{ direction: D.UP }, _],
      [_, { direction: D.DOWN }],
    ];

    // Simulate several moves
    let board = cloneBoard(levelBoard);
    board = removeArrow(board, 0, 0);
    board = removeArrow(board, 1, 1);

    // Board is now fully empty
    expect(board[0][0]).toBeNull();
    expect(board[1][1]).toBeNull();

    // Reset = cloneBoard from original level
    const resetBoard = cloneBoard(levelBoard);
    expect(resetBoard).toEqual(levelBoard);
    expect(resetBoard[0][0]).toEqual({ direction: D.UP });
    expect(resetBoard[1][1]).toEqual({ direction: D.DOWN });
  });
});

