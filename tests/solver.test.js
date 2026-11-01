/**
 * solver.test.js — AI Solver & Hint Tests
 *
 * Verify:
 * 1. greedySolve returns valid solution for all 20 campaign levels
 * 2. Each step in solution is actually a legal move
 * 3. Solution leads to empty board (win condition)
 * 4. Unsolvable boards return null
 * 5. getBestHint returns a valid free move
 * 6. Hint move is always a currently free arrow
 * 7. isSolvable matches greedySolve result
 */

import { describe, it, expect } from 'vitest';
import { greedySolve, isSolvable } from '../src/ai/solver.js';
import { getBestHint } from '../src/ai/hintEngine.js';
import { isPathClear } from '../src/engine/pathValidator.js';
import { cloneBoard, removeArrow } from '../src/engine/gameState.js';
import { isLevelComplete, DIRECTIONS as D } from '../src/engine/gameRules.js';
import { levels } from '../src/data/levels.js';

const _ = null;

describe('solver — greedySolve', () => {

  it('should solve a trivially free board', () => {
    const board = [
      [{ direction: D.UP }, _, _],
      [_, _, _],
      [_, _, _],
    ];
    const solution = greedySolve(board);
    expect(solution).not.toBeNull();
    expect(solution).toHaveLength(1);
    expect(solution[0]).toEqual({ r: 0, c: 0 });
  });

  it('should return null for an unsolvable board (mutual blockers)', () => {
    const board = [
      [{ direction: D.RIGHT }, { direction: D.LEFT }],
    ];
    const solution = greedySolve(board);
    expect(solution).toBeNull();
  });

  it('should return empty array for already-empty board', () => {
    const board = [[_, _], [_, _]];
    const solution = greedySolve(board);
    expect(solution).not.toBeNull();
    expect(solution).toHaveLength(0);
  });

  it('should produce a valid sequence where each step is a legal move', () => {
    const board = [
      [{ direction: D.UP },    _,                      _               ],
      [{ direction: D.LEFT },  _,                      _               ],
      [_,                      { direction: D.DOWN },  { direction: D.DOWN }],
    ];
    const solution = greedySolve(board);
    expect(solution).not.toBeNull();

    // Replay the solution and verify each move is legal
    let current = cloneBoard(board);
    for (const { r, c } of solution) {
      expect(current[r][c]).not.toBeNull(); // arrow exists
      const result = isPathClear(current, r, c);
      expect(result.clear).toBe(true); // path is clear
      current = removeArrow(current, r, c);
    }
    expect(isLevelComplete(current)).toBe(true);
  });

  it('should handle a dependency chain correctly', () => {
    // B blocks A. B must exit before A.
    const board = [
      [{ direction: D.UP }, _, _], // A at (0,0) — clear
      [{ direction: D.UP }, _, _], // B at (1,0) — blocked by A
      [_, _, _],
    ];
    const solution = greedySolve(board);
    expect(solution).not.toBeNull();
    expect(solution).toHaveLength(2);

    // A (0,0) must be removed first since B (1,0) is blocked by A
    expect(solution[0]).toEqual({ r: 0, c: 0 });
    expect(solution[1]).toEqual({ r: 1, c: 0 });
  });
});

describe('solver — ALL 20 campaign levels must be solvable', () => {

  levels.forEach((level, idx) => {
    it(`Level ${level.id} (${level.name}, ${level.tier}, ${level.rows}×${level.cols}) should be solvable`, () => {
      const solution = greedySolve(level.board);
      expect(solution).not.toBeNull();
      expect(solution.length).toBeGreaterThan(0);

      // Verify by replaying
      let board = cloneBoard(level.board);
      for (const { r, c } of solution) {
        expect(board[r][c]).not.toBeNull();
        const result = isPathClear(board, r, c);
        expect(result.clear).toBe(true);
        board = removeArrow(board, r, c);
      }
      expect(isLevelComplete(board)).toBe(true);
    });
  });

  it('should have exactly 20 campaign levels', () => {
    expect(levels).toHaveLength(20);
  });
});

describe('solver — isSolvable', () => {

  it('should return true for solvable boards', () => {
    const board = [
      [{ direction: D.UP }, _, _],
      [_, _, _],
    ];
    expect(isSolvable(board)).toBe(true);
  });

  it('should return false for unsolvable boards', () => {
    const board = [
      [{ direction: D.RIGHT }, { direction: D.LEFT }],
    ];
    expect(isSolvable(board)).toBe(false);
  });

  it('should return true for empty board', () => {
    expect(isSolvable([[_, _]])).toBe(true);
  });
});

describe('hintEngine — getBestHint', () => {

  it('should return a valid free move', () => {
    const board = [
      [{ direction: D.UP }, _, _],
      [_, _, { direction: D.RIGHT }],
      [_, _, _],
    ];
    const hint = getBestHint(board);
    expect(hint).not.toBeNull();
    // Verify the hint is a valid free move
    const result = isPathClear(board, hint.r, hint.c);
    expect(result.clear).toBe(true);
  });

  it('should return null when no moves are possible', () => {
    const board = [
      [{ direction: D.RIGHT }, { direction: D.LEFT }],
    ];
    const hint = getBestHint(board);
    expect(hint).toBeNull();
  });

  it('should return null for empty board', () => {
    const hint = getBestHint([[_, _]]);
    expect(hint).toBeNull();
  });

  it('should prefer the move that unlocks the most downstream arrows', () => {
    // Arrow at (0,0) UP — free, blocking nothing
    // Arrow at (0,1) UP — free, if removed unlocks (1,1) which is blocked by it
    const board = [
      [{ direction: D.UP }, { direction: D.UP }, _],
      [_,                   { direction: D.UP }, _],
      [_, _, _],
    ];
    const hint = getBestHint(board);
    expect(hint).not.toBeNull();
    // (0,1) should be preferred since removing it frees (1,1)
    expect(hint).toEqual({ r: 0, c: 1 });
  });

  it('hint should always be from the set of currently free arrows', () => {
    // Test with every campaign level
    levels.forEach((level) => {
      const hint = getBestHint(level.board);
      if (hint) {
        const result = isPathClear(level.board, hint.r, hint.c);
        expect(result.clear).toBe(true);
      }
    });
  });
});

