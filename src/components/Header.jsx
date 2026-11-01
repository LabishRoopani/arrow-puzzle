/**
 * Header.jsx — Member 1: UI Component
 * Logo, level indicator, move counter, and timer display.
 *
 * Props:
 *  - levelName: string
 *  - levelTier: string
 *  - moveCount: number
 *  - elapsedSeconds: number
 */

import { Target } from 'lucide-react';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Header({ levelName = 'Level 1', levelTier = 'Tutorial', moveCount = 0, elapsedSeconds = 0 }) {
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Target size={22} className="text-indigo-400" />
        <span className="font-bold text-slate-100 tracking-tight text-lg">Arrow Puzzle</span>
      </div>

      {/* Level Info */}
      <div className="flex flex-col items-center">
        <span className="text-slate-100 font-semibold text-sm">{levelName}</span>
        <span className="text-slate-500 text-xs">{levelTier}</span>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-end text-xs text-slate-400">
        <span>Moves: <b className="text-indigo-300">{moveCount}</b></span>
        <span>{pad(mins)}:{pad(secs)}</span>
      </div>
    </header>
  );
}
