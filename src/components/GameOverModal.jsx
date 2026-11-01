/**
 * GameOverModal.jsx — Out of Hearts Popup
 * Offers Revive with Ad (+3 Hearts) or Restart Level.
 */

import { HeartCrack, Film, RotateCcw } from 'lucide-react';

export default function GameOverModal({ isOpen, onReviveWithAd, onRestart }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-3">
          <HeartCrack size={34} />
        </div>

        <h3 className="text-xl font-black text-slate-800 mb-1">Out of Lives!</h3>
        <p className="text-slate-500 text-xs mb-6">
          You made 3 collision mistakes on this puzzle.
        </p>

        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onReviveWithAd}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer"
          >
            <Film size={16} />
            Revive (+3 Lives)
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 active:scale-95 cursor-pointer"
          >
            <RotateCcw size={14} />
            Restart Level
          </button>
        </div>
      </div>
    </div>
  );
}

