/**
 * stateCorruption.test.js — Animation & Rapid Input State Corruption Tests
 *
 * Verify:
 * 1. Rapid sequential removes don't corrupt board state
 * 2. Removing same cell twice is harmless (idempotent)
 * 3. removeArrow on null cell doesn't crash
 * 4. History stack maintains correct depth
 * 5. Undo after multiple rapid moves restores correct states
 * 6. Board immutability holds across many operations
 */

import { describe, it, expect } from 'vitest';
import { cloneBoard, removeArrow } from '../src/engine/gameState.js';
import { isPathClear } from '../src/engine/pathValidator.js';
import { isLevelComplete, DIRECTIONS as D } from '../src/engine/gameRules.js';
import { greedySolve } from '../src/ai/solver.js';

const _ = null;

describe('stateCorruption — Rapid sequential operations', () => {

  it('should handle 100 sequential cloneBoard calls without corruption', () => {
    const board = [
      [{ direction: D.UP }, { direction: D.RIGHT }],
      [{ direction: D.LEFT }, { direction: D.DOWN }],
    ];
    let current = board;
    for (let i = 0; i < 100; i++) {
      current = cloneBoard(current);
    }
    expect(current).toEqual(board);
    // Original untouched
    current[0][0] = null;
    expect(board[0][0]).toEqual({ direction: D.UP });
  });

  it('should handle rapid removes in sequence without corrupting other cells', () => {
    const board = [
      [{ direction: D.UP },    { direction: D.UP },    { direction: D.RIGHT }],
      [{ direction: D.LEFT },  { direction: D.DOWN },  { direction: D.DOWN } ],
    ];

    const history = [];
    let current = cloneBoard(board);

    // Remove all cells in sequence
    const cells = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]];
    for (const [r, c] of cells) {
      if (current[r][c] !== null) {
        history.push(cloneBoard(current));
        current = removeArrow(current, r, c);
      }
    }

    // Board should be completely empty
    expect(isLevelComplete(current)).toBe(true);

    // Undo all — should restore to original
    while (history.length > 0) {
      current = history.pop();
    }
    expect(current).toEqual(board);
  });

  it('removing same cell twice should be harmless', () => {
    const board = [
      [{ direction: D.UP }, _],
      [_, _],
    ];
    const after1 = removeArrow(board, 0, 0);
    expect(after1[0][0]).toBeNull();

    // Remove again — cell is already null, should still work
    const after2 = removeArrow(after1, 0, 0);
    expect(after2[0][0]).toBeNull();
    // No crash, board unchanged
    expect(after2).toEqual(after1);
  });

  it('removeArrow on already-null cell should not crash', () => {
    const board = [[_, _], [_, _]];
    expect(() => removeArrow(board, 0, 0)).not.toThrow();
    const result = removeArrow(board, 0, 0);
    expect(result[0][0]).toBeNull();
  });

  it('isPathClear on null cell should return false without crashing', () => {
    const board = [[_, _], [_, _]];
    expect(() => isPathClear(board, 0, 0)).not.toThrow();
    const result = isPathClear(board, 0, 0);
    expect(result.clear).toBe(false);
  });
});

describe('stateCorruption — History stack integrity', () => {

  it('history depth should match number of moves', () => {
    const board = [
      [{ direction: D.UP }, { direction: D.RIGHT }, _],
      [_, _, _],
    ];
    const history = [];
    let current = cloneBoard(board);

    // Move 1
    history.push(cloneBoard(current));
    current = removeArrow(current, 0, 0);

    // Move 2
    history.push(cloneBoard(current));
    current = removeArrow(current, 0, 1);

    expect(history).toHaveLength(2);
  });

  it('each history entry should be independent (no shared references)', () => {
    const board = [
      [{ direction: D.UP }, { direction: D.RIGHT }],
      [{ direction: D.DOWN }, _],
    ];
    const history = [];
    let current = cloneBoard(board);

    history.push(cloneBoard(current));
    current = removeArrow(current, 0, 0);

    history.push(cloneBoard(current));
    current = removeArrow(current, 0, 1);

    // Mutate current — history entries should be unaffected
    current[1][0] = null;

    expect(history[0][0][0]).toEqual({ direction: D.UP });
    expect(history[0][0][1]).toEqual({ direction: D.RIGHT });
    expect(history[1][0][0]).toBeNull();
    expect(history[1][0][1]).toEqual({ direction: D.RIGHT });
  });
});

describe('stateCorruption — Solver solution replay integrity', () => {

  it('replaying solver solution should never encounter invalid state', () => {
    const board = [
      [{ direction: D.UP },   { direction: D.UP },   { direction: D.RIGHT }],
      [{ direction: D.LEFT }, _,                      _                    ],
      [_,                     { direction: D.DOWN },  { direction: D.DOWN } ],
    ];

    const solution = greedySolve(board);
    expect(solution).not.toBeNull();

    let current = cloneBoard(board);
    const seenStates = [];

    for (const { r, c } of solution) {
      // Arrow must exist at this position
      expect(current[r][c]).not.toBeNull();

      // Path must be clear
      const result = isPathClear(current, r, c);
      expect(result.clear).toBe(true);

      // Store snapshot for uniqueness check
      seenStates.push(JSON.stringify(current));

      current = removeArrow(current, r, c);
    }

    expect(isLevelComplete(current)).toBe(true);

    // All intermediate states should be unique
    const uniqueStates = new Set(seenStates);
    expect(uniqueStates.size).toBe(seenStates.length);
  });
});

