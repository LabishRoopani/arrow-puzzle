/**
 * dependencyGraph.test.js — DAG & Dependency Tests (SPECIAL CHECK)
 *
 * Verify:
 * 1. Dependency graph correctly maps who blocks whom
 * 2. Free arrows have empty dependency sets
 * 3. Blocked arrows correctly reference their blocker
 * 4. Cyclic-like configurations are handled (solver returns null)
 * 5. getFreeMoves returns only truly free arrows
 * 6. All-free board returns all arrows as free
 * 7. All-blocked board returns empty free list
 */

import { describe, it, expect } from 'vitest';
import { buildDependencyGraph, getFreeMoves } from '../src/ai/dependencyGraph.js';
import { DIRECTIONS as D } from '../src/engine/gameRules.js';

const _ = null;

describe('dependencyGraph — buildDependencyGraph', () => {

  it('should have empty deps for arrows with clear paths to border', () => {
    // All arrows point to their nearest border with nothing in the way
    const board = [
      [{ direction: D.UP }, _, _],
      [_, _, { direction: D.RIGHT }],
      [_, { direction: D.DOWN }, _],
    ];
    const deps = buildDependencyGraph(board);
    expect(deps.get('0,0').size).toBe(0);
    expect(deps.get('1,2').size).toBe(0);
    expect(deps.get('2,1').size).toBe(0);
  });

  it('should correctly identify direct blockers', () => {
    // Arrow at (1,0) points UP → blocked by arrow at (0,0)
    const board = [
      [{ direction: D.RIGHT }, _, _],
      [{ direction: D.UP },    _, _],
      [_, _, _],
    ];
    const deps = buildDependencyGraph(board);
    expect(deps.get('1,0').has('0,0')).toBe(true);
    expect(deps.get('0,0').size).toBe(0); // (0,0) RIGHT, clear path
  });

  it('should only record the FIRST blocker in path (nearest obstacle)', () => {
    // Arrow at (2,0) points UP → (1,0) is first blocker, (0,0) not recorded
    const board = [
      [{ direction: D.LEFT }, _, _],
      [{ direction: D.UP },   _, _],
      [{ direction: D.UP },   _, _],
    ];
    const deps = buildDependencyGraph(board);
    const deps20 = deps.get('2,0');
    expect(deps20.has('1,0')).toBe(true);
    expect(deps20.has('0,0')).toBe(false); // only first blocker
    expect(deps20.size).toBe(1);
  });

  it('should handle empty cells correctly (no entries)', () => {
    const board = [[_, _], [_, _]];
    const deps = buildDependencyGraph(board);
    expect(deps.size).toBe(0);
  });

  it('should handle single arrow on board', () => {
    const board = [
      [_, _, _],
      [_, { direction: D.UP }, _],
      [_, _, _],
    ];
    const deps = buildDependencyGraph(board);
    expect(deps.size).toBe(1);
    expect(deps.get('1,1').size).toBe(0); // clear path upward
  });

  it('should correctly map mutual blocking scenario', () => {
    // Two arrows facing each other on same row
    // (0,0) → RIGHT blocked by (0,2); (0,2) → LEFT blocked by (0,0)
    const board = [
      [{ direction: D.RIGHT }, _, { direction: D.LEFT }],
    ];
    const deps = buildDependencyGraph(board);
    expect(deps.get('0,0').has('0,2')).toBe(true);
    expect(deps.get('0,2').has('0,0')).toBe(true);
  });
});

describe('dependencyGraph — getFreeMoves', () => {

  it('should return all arrows when none are blocked', () => {
    const board = [
      [{ direction: D.UP },    _,                     _],
      [_,                      { direction: D.RIGHT }, _],
      [_,                      _,                      { direction: D.DOWN }],
    ];
    const free = getFreeMoves(board);
    expect(free).toHaveLength(3);
  });

  it('should return empty array when all arrows are blocked', () => {
    // Mutual blocking: RIGHT→LEFT, LEFT→RIGHT
    const board = [
      [{ direction: D.RIGHT }, { direction: D.LEFT }],
    ];
    const free = getFreeMoves(board);
    expect(free).toHaveLength(0);
  });

  it('should return only unblocked arrows in mixed scenario', () => {
    const board = [
      [{ direction: D.UP },   { direction: D.DOWN }],
      [_,                     _                    ],
    ];
    // UP at (0,0) → clear (top border)
    // DOWN at (0,1) → goes to (1,1) which is empty, then out → clear
    const free = getFreeMoves(board);
    expect(free).toHaveLength(2);
  });

  it('should correctly identify free moves after removing an arrow', () => {
    const board = [
      [{ direction: D.RIGHT }, _, { direction: D.LEFT }],
    ];
    // Initially mutually blocked
    expect(getFreeMoves(board)).toHaveLength(0);

    // Manually remove one (simulate)
    const board2 = [
      [null, _, { direction: D.LEFT }],
    ];
    const free = getFreeMoves(board2);
    expect(free).toHaveLength(1);
    expect(free[0]).toEqual({ r: 0, c: 2 });
  });

  it('should return empty for empty board', () => {
    const board = [[_, _], [_, _]];
    expect(getFreeMoves(board)).toHaveLength(0);
  });
});

