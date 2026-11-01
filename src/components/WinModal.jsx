/**
 * WinModal.jsx — Member 1: UI Component
 * Victory overlay with star rating, stats, confetti, and Next Level CTA.
 *
 * Props:
 *  - isOpen: boolean
 *  - moveCount: number
 *  - elapsedSeconds: number
 *  - levelName: string
 *  - onNextLevel: () => void
 *  - onReplay: () => void
 *  - onClose: () => void
 */

import { Trophy, Star, RotateCcw, ChevronRight } from 'lucide-react';

function calcStars(moveCount) {
  if (moveCount <= 5)  return 3;
  if (moveCount <= 10) return 2;
  return 1;
}

export default function WinModal({ isOpen, moveCount = 0, elapsedSeconds = 0, levelName = '', onNextLevel, onReplay, onClose }) {
  if (!isOpen) return null;

  const stars = calcStars(moveCount);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-pop-in bg-slate-800 border border-slate-600 rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Trophy Icon */}
        <div className="flex justify-center mb-3">
          <Trophy size={52} className="text-yellow-400 drop-shadow-lg" />
        </div>

        <h2 className="text-2xl font-bold text-slate-100 mb-1">Level Complete!</h2>
        <p className="text-slate-400 text-sm mb-4">{levelName}</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <Star
              key={s}
              size={32}
              className={s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-around mb-6 bg-slate-700/50 rounded-2xl p-3">
          <div>
            <p className="text-slate-400 text-xs">Moves</p>
            <p className="text-indigo-300 font-bold text-xl">{moveCount}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Time</p>
            <p className="text-indigo-300 font-bold text-xl">
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
              {String(elapsedSeconds % 60).padStart(2, '0')}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Stars</p>
            <p className="text-yellow-400 font-bold text-xl">{stars} / 3</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors"
          >
            <RotateCcw size={16} /> Replay
          </button>
          <button
            onClick={onNextLevel}
            className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Next Level <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
