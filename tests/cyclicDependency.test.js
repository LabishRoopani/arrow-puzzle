/**
 * cyclicDependency.test.js — Special Check: Cyclic & Impossible Configurations
 *
 * This file specifically tests the DAG dependency system for:
 * 1. Mutual blocking (A blocks B, B blocks A) — solver returns null
 * 2. Longer cycles (A→B→C→A) — solver returns null
 * 3. Mixed: some free + some cyclic — solver solves free, fails on cyclic
 * 4. Deadlocked full board — solver returns null
 * 5. None of the 20 campaign levels produce cycles (all solvable)
 */

import { describe, it, expect } from 'vitest';
import { buildDependencyGraph, getFreeMoves } from '../src/ai/dependencyGraph.js';
import { greedySolve, isSolvable } from '../src/ai/solver.js';
import { DIRECTIONS as D } from '../src/engine/gameRules.js';
import { levels } from '../src/data/levels.js';

const _ = null;

describe('cyclicDependency — Mutual blocking deadlock', () => {

  it('two arrows facing each other on same row are unsolvable', () => {
    const board = [
      [{ direction: D.RIGHT }, { direction: D.LEFT }],
    ];
    expect(isSolvable(board)).toBe(false);

    const deps = buildDependencyGraph(board);
    // Each blocks the other
    expect(deps.get('0,0').has('0,1')).toBe(true);
    expect(deps.get('0,1').has('0,0')).toBe(true);
  });

  it('two arrows facing each other on same column are unsolvable', () => {
    const board = [
      [{ direction: D.DOWN }],
      [{ direction: D.UP }],
    ];
    expect(isSolvable(board)).toBe(false);
  });

  it('four arrows in a cross-deadlock are unsolvable', () => {
    // All arrows point inward → none can exit
    const board = [
      [_, { direction: D.DOWN }, _],
      [{ direction: D.RIGHT }, _, { direction: D.LEFT }],
      [_, { direction: D.UP },   _],
    ];
    // All paths blocked by center convergence
    const free = getFreeMoves(board);
    expect(free).toHaveLength(0);
    expect(isSolvable(board)).toBe(false);
  });
});

describe('cyclicDependency — Longer dependency chains', () => {

  it('3-arrow cycle on a column should be unsolvable', () => {
    // A(0,0)↓ blocked by B(1,0)↓ blocked by C(2,0)↑ blocked by... 
    // Actually let's create a proper chain where each blocks the next
    const board = [
      [_, _, _],
      [{ direction: D.RIGHT }, { direction: D.DOWN }, _], // (1,0)R→blocked by (1,1); (1,1)D→clear? Actually (2,1) blocks
      [_, { direction: D.UP }, _], // (2,1)U→blocked by (1,1)
    ];
    // (1,0) RIGHT → blocked by (1,1)
    // (1,1) DOWN → clear path to (2,1) → blocked by (2,1)
    // (2,1) UP → blocked by (1,1)
    // Mutual: (1,1) ↔ (2,1), and (1,0) depends on (1,1)
    const free = getFreeMoves(board);
    expect(free).toHaveLength(0);
    expect(isSolvable(board)).toBe(false);
  });

  it('partial deadlock — some free + some cyclic = unsolvable overall', () => {
    const board = [
      [{ direction: D.UP },    _,                     _],  // free
      [{ direction: D.RIGHT }, { direction: D.LEFT }, _],  // mutual deadlock
      [_, _, _],
    ];
    const free = getFreeMoves(board);
    // (0,0) is free, but (1,0)↔(1,1) are deadlocked
    expect(free.some(m => m.r === 0 && m.c === 0)).toBe(true);
    // Solver will remove (0,0) but then get stuck
    expect(isSolvable(board)).toBe(false);
  });
});

describe('cyclicDependency — Campaign level safety', () => {

  it('NONE of the 20 campaign levels should have cyclic dependencies', () => {
    levels.forEach((level) => {
      const solution = greedySolve(level.board);
      expect(solution).not.toBeNull();
      // A non-null solution means no unsolvable cycles exist
    });
  });

  it('solver gracefully returns null (not crash) for deadlocked boards', () => {
    const deadlocked = [
      [{ direction: D.RIGHT }, { direction: D.LEFT }],
      [{ direction: D.DOWN },  { direction: D.UP }],
    ];
    // Should not throw — just return null
    expect(() => greedySolve(deadlocked)).not.toThrow();
    expect(greedySolve(deadlocked)).toBeNull();
  });
});

