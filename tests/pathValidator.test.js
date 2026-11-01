/**
 * pathValidator.test.js — Arrow Movement Tests
 *
 * Verify:
 * 1. Blocked arrow is NOT removed (isPathClear returns false)
 * 2. Valid arrow with clear path IS allowed (isPathClear returns true)
 * 3. Empty cell returns false
 * 4. Border-adjacent arrows pointing outward always clear
 * 5. Multi-blocker chains only report the FIRST blocker
 * 6. All four directions tested
 */

import { describe, it, expect } from 'vitest';
import { isPathClear } from '../src/engine/pathValidator.js';
import { DIRECTIONS as D } from '../src/engine/gameRules.js';

const _ = null;
const UP = (dir) => ({ direction: dir });

describe('pathValidator — isPathClear', () => {

  // ── Clear paths (arrow can exit) ──────────────────────────────────────────

  it('should return clear for UP arrow at top row (border-adjacent)', () => {
    const board = [
      [UP(D.UP), _, _],
      [_, _, _],
      [_, _, _],
    ];
    const result = isPathClear(board, 0, 0);
    expect(result.clear).toBe(true);
  });

  it('should return clear for RIGHT arrow at rightmost col', () => {
    const board = [
      [_, _, UP(D.RIGHT)],
      [_, _, _],
    ];
    const result = isPathClear(board, 0, 2);
    expect(result.clear).toBe(true);
  });

  it('should return clear for DOWN arrow at bottom row', () => {
    const board = [
      [_, _, _],
      [_, _, _],
      [_, UP(D.DOWN), _],
    ];
    const result = isPathClear(board, 2, 1);
    expect(result.clear).toBe(true);
  });

  it('should return clear for LEFT arrow at leftmost col', () => {
    const board = [
      [_, _, _],
      [UP(D.LEFT), _, _],
      [_, _, _],
    ];
    const result = isPathClear(board, 1, 0);
    expect(result.clear).toBe(true);
  });

  it('should return clear for UP arrow with only empty cells above', () => {
    const board = [
      [_, _, _],
      [_, _, _],
      [_, UP(D.UP), _],
    ];
    const result = isPathClear(board, 2, 1);
    expect(result.clear).toBe(true);
  });

  // ── Blocked paths ─────────────────────────────────────────────────────────

  it('should return blocked when another arrow is directly in the path', () => {
    const board = [
      [UP(D.DOWN), _, _],
      [UP(D.RIGHT), _, _],
      [_, _, _],
    ];
    // UP(D.DOWN) at (0,0) wants to go down → hits (1,0)
    const result = isPathClear(board, 0, 0);
    expect(result.clear).toBe(false);
    expect(result.blockedBy).toEqual({ r: 1, c: 0 });
  });

  it('should return blocked when arrow is blocked several cells away', () => {
    const board = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [UP(D.RIGHT), _, _, UP(D.UP), _],
      [_, _, _, _, _],
    ];
    // RIGHT at (2,0) → steps through (2,1), (2,2), hits (2,3)
    const result = isPathClear(board, 2, 0);
    expect(result.clear).toBe(false);
    expect(result.blockedBy).toEqual({ r: 2, c: 3 });
  });

  it('should report the FIRST blocker only in a multi-blocker chain', () => {
    // RIGHT at (0,0), blockers at (0,2) and (0,4)
    const board = [
      [UP(D.RIGHT), _, UP(D.UP), _, UP(D.DOWN)],
    ];
    const result = isPathClear(board, 0, 0);
    expect(result.clear).toBe(false);
    expect(result.blockedBy).toEqual({ r: 0, c: 2 }); // first blocker only
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('should return false for an empty cell (no arrow)', () => {
    const board = [
      [_, _, _],
      [_, _, _],
    ];
    const result = isPathClear(board, 0, 0);
    expect(result.clear).toBe(false);
  });

  it('should work correctly on a 1×1 grid (border-adjacent in all dirs)', () => {
    const board = [[UP(D.UP)]];
    expect(isPathClear(board, 0, 0).clear).toBe(true);

    const board2 = [[UP(D.DOWN)]];
    expect(isPathClear(board2, 0, 0).clear).toBe(true);

    const board3 = [[UP(D.LEFT)]];
    expect(isPathClear(board3, 0, 0).clear).toBe(true);

    const board4 = [[UP(D.RIGHT)]];
    expect(isPathClear(board4, 0, 0).clear).toBe(true);
  });

  it('should handle large grids correctly', () => {
    const size = 10;
    const board = Array.from({ length: size }, () => Array(size).fill(null));
    board[5][0] = { direction: D.RIGHT };
    board[5][9] = { direction: D.LEFT }; // not in path since RIGHT goes 1→9

    // (5,0) pointing RIGHT → path is (5,1)…(5,9). (5,9) is occupied → blocked
    const result = isPathClear(board, 5, 0);
    expect(result.clear).toBe(false);
    expect(result.blockedBy).toEqual({ r: 5, c: 9 });
  });
});

