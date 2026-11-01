/**
 * gameRules.test.js — Game Rules Tests
 *
 * Verify:
 * 1. Direction constants are correct strings
 * 2. Delta vectors match the coordinate system
 * 3. inBounds works at boundaries
 * 4. isLevelComplete detects win condition accurately
 */

import { describe, it, expect } from 'vitest';
import { DIRECTIONS, DELTA, ROTATION, inBounds, isLevelComplete } from '../src/engine/gameRules.js';

describe('gameRules — Constants', () => {

  it('should have exactly 4 directions', () => {
    expect(Object.keys(DIRECTIONS)).toHaveLength(4);
    expect(DIRECTIONS.UP).toBe('UP');
    expect(DIRECTIONS.DOWN).toBe('DOWN');
    expect(DIRECTIONS.LEFT).toBe('LEFT');
    expect(DIRECTIONS.RIGHT).toBe('RIGHT');
  });

  it('delta vectors should match zero-indexed top-left coordinate system', () => {
    // UP = row decreases
    expect(DELTA.UP).toEqual({ r: -1, c: 0 });
    // DOWN = row increases
    expect(DELTA.DOWN).toEqual({ r: 1, c: 0 });
    // LEFT = col decreases
    expect(DELTA.LEFT).toEqual({ r: 0, c: -1 });
    // RIGHT = col increases
    expect(DELTA.RIGHT).toEqual({ r: 0, c: 1 });
  });

  it('rotation degrees should be correct for CSS transforms', () => {
    expect(ROTATION.UP).toBe(0);
    expect(ROTATION.RIGHT).toBe(90);
    expect(ROTATION.DOWN).toBe(180);
    expect(ROTATION.LEFT).toBe(270);
  });
});

describe('gameRules — inBounds', () => {

  it('should return true for valid positions', () => {
    expect(inBounds(0, 0, 3, 3)).toBe(true);
    expect(inBounds(2, 2, 3, 3)).toBe(true);
    expect(inBounds(1, 1, 3, 3)).toBe(true);
  });

  it('should return false for out-of-bounds positions', () => {
    expect(inBounds(-1, 0, 3, 3)).toBe(false);
    expect(inBounds(0, -1, 3, 3)).toBe(false);
    expect(inBounds(3, 0, 3, 3)).toBe(false);
    expect(inBounds(0, 3, 3, 3)).toBe(false);
    expect(inBounds(10, 10, 3, 3)).toBe(false);
  });

  it('should handle 1×1 grid', () => {
    expect(inBounds(0, 0, 1, 1)).toBe(true);
    expect(inBounds(1, 0, 1, 1)).toBe(false);
  });
});

describe('gameRules — isLevelComplete', () => {

  it('should return true when all cells are null', () => {
    const board = [
      [null, null, null],
      [null, null, null],
    ];
    expect(isLevelComplete(board)).toBe(true);
  });

  it('should return false when any cell has an arrow', () => {
    const board = [
      [null, null, null],
      [null, { direction: 'UP' }, null],
    ];
    expect(isLevelComplete(board)).toBe(false);
  });

  it('should return false when only one arrow remains', () => {
    const board = [
      [null, null],
      [null, null],
      [null, { direction: 'DOWN' }],
    ];
    expect(isLevelComplete(board)).toBe(false);
  });

  it('should return true for 1×1 grid with null', () => {
    expect(isLevelComplete([[null]])).toBe(true);
  });
});

