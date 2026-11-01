/**
 * Board.jsx — Member 1: UI Component
 * Responsive N×M grid that renders arrow tiles.
 *
 * Props:
 *  - board: 2D array of { direction } | null
 *  - onCellClick: (row, col) => void
 *  - animStates: { "r,c": 'idle'|'shake'|'fly' }
 *  - hintCell: { r, c } | null
 */

import ArrowCell from './ArrowCell.jsx';

export default function Board({ board, onCellClick, animStates = {}, hintCell = null }) {
  if (!board || board.length === 0) return null;

  const rows = board.length;
  const cols = board[0].length;

  return (
    <div
      className="grid gap-2 p-3 bg-slate-800/60 rounded-2xl border border-slate-700 backdrop-blur"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        width: `min(90vw, ${cols * 76}px)`,
        aspectRatio: `${cols} / ${rows}`,
      }}
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          const key       = `${r},${c}`;
          const animState = animStates[key] || 'idle';
          const isHint    = hintCell && hintCell.r === r && hintCell.c === c;

          if (!cell) {
            // Empty cell — render a subtle ghost placeholder
            return (
              <div
                key={key}
                className="rounded-xl border border-slate-700/40 bg-slate-800/30"
              />
            );
          }

          return (
            <ArrowCell
              key={key}
              direction={cell.direction}
              onClick={() => onCellClick(r, c)}
              animState={animState}
              isHint={isHint}
            />
          );
        })
      )}
    </div>
  );
}
