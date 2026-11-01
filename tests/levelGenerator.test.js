/**
 * levelGenerator.test.js — Infinite Cycle Level Generator Tests
 *
 * Verifies:
 * 1. Infinite cycling: 1: Easy -> 2: Medium -> 3: Hard -> 4: Extreme -> 5: Easy -> ...
 * 2. Generated boards for Easy, Medium, Hard, Extreme are 100% solvable
 * 3. All placed arrows have valid directional attributes
 */

import { describe, it, expect } from 'vitest';
import { 
  generateSolvableLevel, 
  getLevelTier, 
  DIFFICULTY_PRESETS,
  TIERS 
} from '../src/ai/levelGenerator.js';
import { greedySolve } from '../src/ai/solver.js';
import { DIRECTIONS } from '../src/engine/gameRules.js';

const VALID_DIRS = new Set(Object.values(DIRECTIONS));

describe('levelGenerator — Infinite Tier Cycling', () => {

  it('should cycle through Easy, Medium, Hard, Extreme indefinitely', () => {
    expect(getLevelTier(1)).toBe('Easy');
    expect(getLevelTier(2)).toBe('Medium');
    expect(getLevelTier(3)).toBe('Hard');
    expect(getLevelTier(4)).toBe('Extreme');

    // Cycle repeats
    expect(getLevelTier(5)).toBe('Easy');
    expect(getLevelTier(6)).toBe('Medium');
    expect(getLevelTier(7)).toBe('Hard');
    expect(getLevelTier(8)).toBe('Extreme');

    expect(getLevelTier(9)).toBe('Easy');
    expect(getLevelTier(100)).toBe('Extreme'); // 100 % 4 === 0 -> Extreme
    expect(getLevelTier(101)).toBe('Easy');
  });

  it('should have all 4 difficulty presets defined', () => {
    expect(TIERS).toEqual(['Easy', 'Medium', 'Hard', 'Extreme']);
    TIERS.forEach(tier => {
      expect(DIFFICULTY_PRESETS[tier]).toBeDefined();
      expect(DIFFICULTY_PRESETS[tier].rows).toBeGreaterThanOrEqual(4);
      expect(DIFFICULTY_PRESETS[tier].arrowCount).toBeGreaterThanOrEqual(6);
    });
  });
});

describe('levelGenerator — Solvability Verification', () => {

  it('should generate a solvable Easy level', () => {
    const level = generateSolvableLevel('Easy');
    expect(level).toBeDefined();
    expect(level.board).toBeDefined();
    const solution = greedySolve(level.board);
    expect(solution).not.toBeNull();
    expect(solution.length).toBeGreaterThan(0);
  });

  it('should generate a solvable Medium level', () => {
    const level = generateSolvableLevel('Medium');
    expect(level).toBeDefined();
    const solution = greedySolve(level.board);
    expect(solution).not.toBeNull();
    expect(solution.length).toBeGreaterThan(0);
  });

  it('should generate a solvable Hard level', () => {
    const level = generateSolvableLevel('Hard');
    expect(level).toBeDefined();
    const solution = greedySolve(level.board);
    expect(solution).not.toBeNull();
    expect(solution.length).toBeGreaterThan(0);
  });

  it('should generate a solvable Extreme level', () => {
    const level = generateSolvableLevel('Extreme');
    expect(level).toBeDefined();
    const solution = greedySolve(level.board);
    expect(solution).not.toBeNull();
    expect(solution.length).toBeGreaterThan(0);
  });

  it('all arrows should have valid directions', () => {
    const level = generateSolvableLevel('Medium');
    for (const row of level.board) {
      for (const cell of row) {
        if (cell !== null) {
          expect(VALID_DIRS.has(cell.direction)).toBe(true);
        }
      }
    }
  });
});
