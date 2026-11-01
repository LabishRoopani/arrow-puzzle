/**
 * levelProgression.test.js — Level Progression & Catalog Tests
 *
 * Verifies:
 * 1. 20 levels exist with required fields
 * 2. Level IDs are sequential (1–20)
 * 3. Board dimensions match declared rows/cols
 * 4. Tier cycle follows Easy -> Medium -> Hard -> Extreme
 * 5. TOTAL_LEVELS matches actual array length
 */

import { describe, it, expect } from 'vitest';
import { levels, TOTAL_LEVELS } from '../src/data/levels.js';
import { DIRECTIONS } from '../src/engine/gameRules.js';
import { TIERS } from '../src/ai/levelGenerator.js';

const VALID_DIRS = new Set(Object.values(DIRECTIONS));

function countArrows(board) {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell !== null) count++;
    }
  }
  return count;
}

describe('levelProgression — Catalog integrity', () => {

  it('should have exactly 20 levels in starter catalog', () => {
    expect(levels).toHaveLength(20);
  });

  it('TOTAL_LEVELS should match levels array length', () => {
    expect(TOTAL_LEVELS).toBe(levels.length);
  });

  it('level IDs should be sequential 1–20', () => {
    levels.forEach((level, idx) => {
      expect(level.id).toBe(idx + 1);
    });
  });

  levels.forEach((level, idx) => {
    describe(`Level ${level.id} (${level.name})`, () => {

      it('should have all required fields', () => {
        expect(level.id).toBeDefined();
        expect(level.name).toBeDefined();
        expect(level.tier).toBeDefined();
        expect(level.rows).toBeDefined();
        expect(level.cols).toBeDefined();
        expect(level.board).toBeDefined();
        expect(typeof level.id).toBe('number');
        expect(typeof level.name).toBe('string');
        expect(typeof level.tier).toBe('string');
        expect(typeof level.rows).toBe('number');
        expect(typeof level.cols).toBe('number');
        expect(Array.isArray(level.board)).toBe(true);
      });

      it('should have a valid tier from Easy, Medium, Hard, Extreme', () => {
        expect(TIERS).toContain(level.tier);
      });

      it('board dimensions should match declared rows×cols', () => {
        expect(level.board).toHaveLength(level.rows);
        level.board.forEach(row => {
          expect(row).toHaveLength(level.cols);
        });
      });

      it('all arrows should have valid direction values', () => {
        for (const row of level.board) {
          for (const cell of row) {
            if (cell !== null) {
              expect(cell.direction).toBeDefined();
              expect(VALID_DIRS.has(cell.direction)).toBe(true);
            }
          }
        }
      });

      it('should have at least 1 arrow', () => {
        expect(countArrows(level.board)).toBeGreaterThan(0);
      });
    });
  });
});

describe('levelProgression — 4-Tier Infinite Cycle', () => {

  it('levels should follow Easy -> Medium -> Hard -> Extreme cycle', () => {
    levels.forEach((lvl, idx) => {
      const expectedTier = TIERS[idx % 4];
      expect(lvl.tier).toBe(expectedTier);
    });
  });
});
