/**
 * WinModal.jsx — Premium Victory Celebration Modal
 * Displays:
 * - Animated glowing Stars based on remaining hearts
 * - Completion Time & Moves
 * - "New Record!" badge if fastest time
 * - XP Gain Counter (+XP)
 * - Next Level & Replay CTA buttons
 */

import { Trophy, Star, RotateCcw, ChevronRight, Sparkles, Clock, Zap } from 'lucide-react';

export default function WinModal({
  isOpen,
  moveCount = 0,
  elapsedSeconds = 0,
  levelName = '',
  stars = 3,
  isNewBestTime = false,
  xpEarned = 150,
  onNextLevel,
  onReplay,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="animate-pop-in bg-[#111631] border border-white/10 rounded-3xl p-6 mx-auto max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Trophy Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shadow-xl shadow-amber-500/10">
            <Trophy size={36} className="text-amber-400 drop-shadow-md animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white mb-0.5 tracking-tight">
          Level Cleared!
        </h2>
        <p className="text-slate-400 text-xs mb-4 font-semibold">{levelName}</p>

        {/* 3 Animated Stars */}
        <div className="flex justify-center gap-3 mb-5">
          {[1, 2, 3].map(s => {
            const filled = s <= stars;
            return (
              <div key={s} className="relative">
                <Star
                  size={40}
                  className={`transition-all duration-500 ${
                    filled
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pop-in'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                  style={{ animationDelay: `${s * 150}ms` }}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 bg-white/5 border border-white/[0.08] rounded-2xl p-3">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Moves</span>
            <p className="text-base font-black text-cyan-300">{moveCount}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Time</span>
            <p className="text-base font-black text-cyan-300">
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
              {String(elapsedSeconds % 60).padStart(2, '0')}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Stars</span>
            <p className="text-base font-black text-amber-400">{stars} / 3</p>
          </div>
        </div>

        {/* New Record Banner if applicable */}
        {isNewBestTime && (
          <div className="mb-4 py-1.5 px-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-black flex items-center justify-center gap-1.5 animate-pulse">
            <Sparkles size={13} />
            <span>New Best Time Record!</span>
          </div>
        )}

        {/* XP Gain Pill */}
        <div className="mb-5 inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 px-3.5 py-1 rounded-full text-xs font-black text-cyan-300">
          <Zap size={13} className="text-amber-400 fill-amber-400" />
          <span>+{xpEarned} XP Earned</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/10 text-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
          >
            <RotateCcw size={15} />
            <span>Replay</span>
          </button>
          <button
            onClick={onNextLevel}
            className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-extrabold text-xs shadow-xl shadow-cyan-500/25 transition cursor-pointer active:scale-95 border border-cyan-400/30"
          >
            <span>Next Level</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
