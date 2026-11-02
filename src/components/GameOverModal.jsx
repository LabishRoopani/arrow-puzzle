/**
 * GameOverModal.jsx — Dark Cosmic Out-of-Hearts Modal
 */

import { HeartCrack, Film, RotateCcw } from 'lucide-react';

export default function GameOverModal({ isOpen, onReviveWithAd, onRestart }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-[#111631] border border-white/10 rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl flex flex-col items-center animate-pop-in">
        <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-400/25 flex items-center justify-center text-rose-400 mb-3">
          <HeartCrack size={34} />
        </div>

        <h3 className="text-xl font-black text-white mb-1">Out of Lives!</h3>
        <p className="text-slate-500 text-xs mb-6">
          You made 3 collision mistakes on this puzzle.
        </p>

        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onReviveWithAd}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer border border-cyan-400/20"
          >
            <Film size={16} />
            Revive (+3 Lives)
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl bg-white/[0.06] text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <RotateCcw size={14} />
            Restart Level
          </button>
        </div>
      </div>
    </div>
  );
}
